import { PartialType } from '@nestjs/mapped-types';
import { CreateApiDto } from './create-api.dto';
import { IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiStatus } from '@prisma/client';

export class UpdateApiDto extends PartialType(CreateApiDto) {
    @IsOptional()
    @IsEnum(ApiStatus)
    status?: ApiStatus;

    @IsOptional()
    @IsBoolean()
    isFeatured?: boolean;

    @IsOptional()
    @IsBoolean()
    isDeprecated?: boolean;
}
