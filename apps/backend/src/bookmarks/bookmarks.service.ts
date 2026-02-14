import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarksService {
    constructor(private prisma: PrismaService) { }

    async toggle(userId: string, apiId: string) {
        const existing = await this.prisma.bookmark.findUnique({
            where: { userId_apiId: { userId, apiId } },
        });

        if (existing) {
            await this.prisma.$transaction([
                this.prisma.bookmark.delete({ where: { id: existing.id } }),
                this.prisma.api.update({
                    where: { id: apiId },
                    data: { bookmarkCount: { decrement: 1 } },
                }),
            ]);
            return { bookmarked: false };
        }

        try {
            await this.prisma.$transaction([
                this.prisma.bookmark.create({ data: { userId, apiId } }),
                this.prisma.api.update({
                    where: { id: apiId },
                    data: { bookmarkCount: { increment: 1 } },
                }),
            ]);
            return { bookmarked: true };
        } catch (error: any) {
            // Race condition: another request already created the bookmark
            if (error.code === 'P2002') {
                return { bookmarked: true };
            }
            throw error;
        }
    }

    async findUserBookmarks(userId: string, page = 1, limit = 12) {
        const skip = (page - 1) * limit;

        const [bookmarks, total] = await Promise.all([
            this.prisma.bookmark.findMany({
                where: { userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    api: {
                        include: {
                            category: true,
                            tags: { include: { tag: true } },
                        },
                    },
                },
            }),
            this.prisma.bookmark.count({ where: { userId } }),
        ]);

        return {
            data: bookmarks.map((b) => ({
                ...b,
                api: {
                    ...b.api,
                    tags: b.api.tags.map((at) => at.tag),
                },
            })),
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async isBookmarked(userId: string, apiId: string) {
        const bookmark = await this.prisma.bookmark.findUnique({
            where: { userId_apiId: { userId, apiId } },
        });
        return { bookmarked: !!bookmark };
    }
}
