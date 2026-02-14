import { IsOptional, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PricingType, AuthType, RateLimit } from '@prisma/client';

export class QueryApisDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    category?: string; // category slug

    @IsOptional()
    @IsEnum(PricingType)
    pricingType?: PricingType;

    @IsOptional()
    @IsEnum(AuthType)
    authType?: AuthType;

    @IsOptional()
    @IsEnum(RateLimit)
    rateLimit?: RateLimit;

    @IsOptional()
    @IsString()
    tag?: string; // tag slug

    @IsOptional()
    @IsString()
    sort?: 'newest' | 'popular' | 'rating' | 'free-first';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(50)
    limit?: number = 12;
}
