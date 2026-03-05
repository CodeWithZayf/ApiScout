import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubmissionStatus } from '@prisma/client';

@Injectable()
export class SubmissionsService {
    constructor(private prisma: PrismaService) { }

    async create(
        userId: string,
        data: {
            name: string;
            websiteUrl: string;
            documentationUrl: string;
            description: string;
            categoryName: string;
            providerContact?: string;
        },
    ) {
        return this.prisma.apiSubmission.create({
            data: {
                ...data,
                submittedBy: userId,
            },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }

    async findAll(status?: SubmissionStatus, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const where = status ? { status } : {};

        const [submissions, total] = await Promise.all([
            this.prisma.apiSubmission.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
                include: {
                    user: { select: { id: true, name: true, email: true } },
                },
            }),
            this.prisma.apiSubmission.count({ where }),
        ]);

        return {
            data: submissions,
            meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
        };
    }

    async findUserSubmissions(userId: string, page = 1, limit = 20) {
        const take = Math.min(limit, 100);
        const skip = (page - 1) * take;

        const [submissions, total] = await Promise.all([
            this.prisma.apiSubmission.findMany({
                where: { submittedBy: userId },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            this.prisma.apiSubmission.count({ where: { submittedBy: userId } }),
        ]);

        return {
            data: submissions,
            meta: { total, page, limit: take, totalPages: Math.ceil(total / take) },
        };
    }

    async updateStatus(id: string, status: SubmissionStatus, reviewNotes?: string) {
        const submission = await this.prisma.apiSubmission.findUnique({ where: { id } });
        if (!submission) {
            throw new NotFoundException('Submission not found');
        }

        return this.prisma.apiSubmission.update({
            where: { id },
            data: { status, reviewNotes },
            include: {
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
}
