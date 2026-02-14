import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FeedbackType } from '@prisma/client';

@Injectable()
export class FeedbackService {
    constructor(private prisma: PrismaService) { }

    async toggle(userId: string, apiId: string, type: FeedbackType) {
        const existing = await this.prisma.feedbackSignal.findUnique({
            where: { userId_apiId_type: { userId, apiId, type } },
        });

        if (existing) {
            await this.prisma.feedbackSignal.delete({ where: { id: existing.id } });
            return { toggled: false, type };
        }

        await this.prisma.feedbackSignal.create({
            data: { userId, apiId, type },
        });

        return { toggled: true, type };
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
