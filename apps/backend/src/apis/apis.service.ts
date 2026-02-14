import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryApisDto } from './dto/query-apis.dto';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ApisService {
    constructor(private prisma: PrismaService) { }

    async findAll(query: QueryApisDto) {
        const { search, category, pricingType, authType, rateLimit, tag, sort, page = 1, limit = 12 } = query;
        const skip = (page - 1) * limit;

        const where: Prisma.ApiWhereInput = {
            status: 'ACTIVE',
        };

        // Search by name + description
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { providerName: { contains: search, mode: 'insensitive' } },
            ];
        }

        // Filter by category slug
        if (category) {
            where.category = { slug: category };
        }

        // Filter by pricing type
        if (pricingType) {
            where.pricingType = pricingType;
        }

        // Filter by auth type
        if (authType) {
            where.authType = authType;
        }

        // Filter by rate limit
        if (rateLimit) {
            where.rateLimit = rateLimit;
        }

        // Filter by tag slug
        if (tag) {
            where.tags = {
                some: { tag: { slug: tag } },
            };
        }

        // Sort order
        let orderBy: Prisma.ApiOrderByWithRelationInput = { createdAt: 'desc' };
        switch (sort) {
            case 'popular':
                orderBy = { viewCount: 'desc' };
                break;
            case 'rating':
                orderBy = { averageRating: 'desc' };
                break;
            case 'free-first':
                orderBy = { pricingType: 'asc' }; // FREE < FREEMIUM < PAID
                break;
            case 'newest':
            default:
                orderBy = { createdAt: 'desc' };
        }

        const [apis, total] = await Promise.all([
            this.prisma.api.findMany({
                where,
                orderBy,
                skip,
                take: limit,
                include: {
                    category: true,
                    tags: { include: { tag: true } },
                },
            }),
            this.prisma.api.count({ where }),
        ]);

        return {
            data: apis.map((api) => ({
                ...api,
                tags: api.tags.map((at) => at.tag),
            })),
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    async findBySlug(slug: string) {
        const api = await this.prisma.api.findUnique({
            where: { slug },
            include: {
                category: true,
                tags: { include: { tag: true } },
                reviews: {
                    include: { user: { select: { id: true, name: true, image: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                feedbackSignals: true,
            },
        });

        if (!api) {
            throw new NotFoundException(`API with slug "${slug}" not found`);
        }

        // Aggregate feedback signals
        const feedbackCounts = await this.prisma.feedbackSignal.groupBy({
            by: ['type'],
            where: { apiId: api.id },
            _count: true,
        });

        return {
            ...api,
            tags: api.tags.map((at) => at.tag),
            feedbackCounts: feedbackCounts.reduce(
                (acc, fc) => ({ ...acc, [fc.type]: fc._count }),
                {} as Record<string, number>,
            ),
        };
    }

    async incrementView(slug: string) {
        await this.prisma.api.update({
            where: { slug },
            data: { viewCount: { increment: 1 } },
        });
        return { success: true };
    }

    async findTrending(limit = 6) {
        const apis = await this.prisma.api.findMany({
            where: { status: 'ACTIVE' },
            orderBy: [{ viewCount: 'desc' }, { averageRating: 'desc' }],
            take: limit,
            include: {
                category: true,
                tags: { include: { tag: true } },
            },
        });

        return apis.map((api) => ({
            ...api,
            tags: api.tags.map((at) => at.tag),
        }));
    }

    async findFeatured(limit = 6) {
        const apis = await this.prisma.api.findMany({
            where: { status: 'ACTIVE', isFeatured: true },
            orderBy: { averageRating: 'desc' },
            take: limit,
            include: {
                category: true,
                tags: { include: { tag: true } },
            },
        });

        return apis.map((api) => ({
            ...api,
            tags: api.tags.map((at) => at.tag),
        }));
    }

    async create(dto: CreateApiDto) {
        const { tagIds, ...data } = dto;
        const slug = await this.generateUniqueSlug(data.name);

        const api = await this.prisma.api.create({
            data: {
                ...data,
                slug,
                tags: tagIds?.length
                    ? { create: tagIds.map((tagId) => ({ tagId })) }
                    : undefined,
            },
            include: {
                category: true,
                tags: { include: { tag: true } },
            },
        });

        return {
            ...api,
            tags: api.tags.map((at) => at.tag),
        };
    }

    async update(id: string, dto: UpdateApiDto) {
        const { tagIds, ...data } = dto;

        // If tagIds provided, delete existing and recreate
        if (tagIds) {
            await this.prisma.apiTag.deleteMany({ where: { apiId: id } });
        }

        const api = await this.prisma.api.update({
            where: { id },
            data: {
                ...data,
                tags: tagIds?.length
                    ? { create: tagIds.map((tagId) => ({ tagId })) }
                    : undefined,
            },
            include: {
                category: true,
                tags: { include: { tag: true } },
            },
        });

        return {
            ...api,
            tags: api.tags.map((at) => at.tag),
        };
    }

    async remove(id: string) {
        await this.prisma.api.delete({ where: { id } });
        return { deleted: true };
    }

    async compare(slugs: string[]) {
        const apis = await this.prisma.api.findMany({
            where: { slug: { in: slugs }, status: 'ACTIVE' },
            include: {
                category: true,
                tags: { include: { tag: true } },
            },
        });

        return apis.map((api) => ({
            ...api,
            tags: api.tags.map((at) => at.tag),
        }));
    }

    private async generateUniqueSlug(name: string): Promise<string> {
        const base = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

        let slug = base;
        let suffix = 2;

        while (await this.prisma.api.findUnique({ where: { slug } })) {
            slug = `${base}-${suffix}`;
            suffix++;
        }

        return slug;
    }
}
