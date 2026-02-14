import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { SubmissionStatus } from '@prisma/client';

export class UpdateSubmissionStatusDto {
    @IsEnum(SubmissionStatus)
    status: SubmissionStatus;

    @IsOptional()
    @IsString()
    @MaxLength(1000)
    reviewNotes?: string;
}
