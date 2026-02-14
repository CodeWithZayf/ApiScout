import { Injectable, ForbiddenException, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, apiId: string, rating: number, comment?: string) {
        // Check for existing review
        const existing = await this.prisma.review.findUnique({
            where: { userId_apiId: { userId, apiId } },
        });
        if (existing) {
            throw new ConflictException('You have already reviewed this API');
        }

        const review = await this.prisma.review.create({
            data: { userId, apiId, rating, comment },
            include: {
                user: { select: { id: true, name: true, image: true } },
            },
        });

        // Update API stats
        await this.updateApiStats(apiId);

        return review;
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

        // Allow deletion only by the review author
        if (review.userId !== userId) {
            throw new ForbiddenException('You can only delete your own reviews');
        }

        await this.prisma.review.delete({ where: { id } });

        // Update API stats
        await this.updateApiStats(review.apiId);

        return { deleted: true };
    }

    private async updateApiStats(apiId: string) {
        const stats = await this.prisma.review.aggregate({
            where: { apiId },
            _avg: { rating: true },
            _count: true,
        });

        await this.prisma.api.update({
            where: { id: apiId },
            data: {
                averageRating: stats._avg.rating ?? 0,
                reviewCount: stats._count,
            },
        });
    }
}
