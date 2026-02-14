import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const categories = await this.prisma.category.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: { select: { apis: true } },
            },
        });

        return categories.map((cat) => ({
            ...cat,
            apiCount: cat._count.apis,
        }));
    }

    async findBySlug(slug: string) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                _count: { select: { apis: true } },
            },
        });

        return category
            ? { ...category, apiCount: category._count.apis }
            : null;
    }

    async create(data: { name: string; slug: string; description?: string; icon?: string }) {
        return this.prisma.category.create({ data });
    }

    async findById(id: string) {
        return this.prisma.category.findUnique({
            where: { id },
            include: { _count: { select: { apis: true } } },
        });
    }

    async update(id: string, data: { name?: string; description?: string; icon?: string }) {
        return this.prisma.category.update({ where: { id }, data });
    }

    async remove(id: string) {
        await this.prisma.category.delete({ where: { id } });
        return { deleted: true };
    }
}
