import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackType, Prisma } from '@prisma/client';

@Injectable()
export class FeedbackService {
    constructor(private prisma: PrismaService) { }

    async toggle(userId: string, apiId: string, type: FeedbackType) {
        // Idempotent toggle: attempt create, catch duplicate to delete
        try {
            await this.prisma.feedbackSignal.create({
                data: { userId, apiId, type },
            });
            return { toggled: true, type };
        } catch (e) {
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                await this.prisma.feedbackSignal.delete({
                    where: { userId_apiId_type: { userId, apiId, type } },
                });
                return { toggled: false, type };
            }
            throw e;
        }
    }

    async getCounts(apiId: string) {
        const counts = await this.prisma.feedbackSignal.groupBy({
            by: ['type'],
            where: { apiId },
            _count: true,
        });

        return counts.reduce(
            (acc, fc) => ({ ...acc, [fc.type]: fc._count }),
            {} as Record<string, number>,
        );
    }
}
