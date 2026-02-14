import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TagsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const tags = await this.prisma.tag.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { apis: true } },
            },
        });

        return tags.map((tag) => ({
            ...tag,
            apiCount: tag._count.apis,
        }));
    }

    async create(data: { name: string; slug: string }) {
        return this.prisma.tag.create({ data });
    }

    async remove(id: string) {
        await this.prisma.tag.delete({ where: { id } });
        return { deleted: true };
    }
}
