import { Injectable, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, apiId: string, rating: number, comment?: string) {
        // Use transaction: create review + update stats atomically
        // Catch P2002 for race condition instead of TOCTOU findUnique check
        try {
            const review = await this.prisma.$transaction(async (tx) => {
                const created = await tx.review.create({
                    data: { userId, apiId, rating, comment },
                    include: {
                        user: { select: { id: true, name: true, image: true } },
                    },
                });

                const stats = await tx.review.aggregate({
                    where: { apiId },
                    _avg: { rating: true },
                    _count: true,
                });

                await tx.api.update({
                    where: { id: apiId },
                    data: {
                        averageRating: stats._avg.rating ?? 0,
                        reviewCount: stats._count,
                    },
                });

                return created;
            });

            return review;
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new ConflictException('You have already reviewed this API');
            }
            throw e;
        }
    }

    async findByApi(apiId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            this.prisma.review.findMany({
                where: { apiId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, image: true } },
                },
            }),
            this.prisma.review.count({ where: { apiId } }),
        ]);

        return {
            data: reviews,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async remove(id: string, userId: string) {
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review) {
            throw new NotFoundException('Review not found');
        }

        if (review.userId !== userId) {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        // Delete review + update stats in transaction
        await this.prisma.$transaction(async (tx) => {
            await tx.review.delete({ where: { id } });

            const stats = await tx.review.aggregate({
                where: { apiId: review.apiId },
                _avg: { rating: true },
                _count: true,
            });

            await tx.api.update({
                where: { id: review.apiId },
                data: {
                    averageRating: stats._avg.rating ?? 0,
                    reviewCount: stats._count,
                },
            });
        });

        return { deleted: true };
    }
}
