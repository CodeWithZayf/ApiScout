import { IsString, IsEnum } from 'class-validator';
import { FeedbackType } from '@prisma/client';

export class CreateFeedbackDto {
    @IsString()
    apiId: string;

    @IsEnum(FeedbackType)
    type: FeedbackType;
}
