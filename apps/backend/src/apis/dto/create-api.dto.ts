import {
    IsString,
    IsOptional,
    IsEnum,
    IsBoolean,
    IsUrl,
    IsArray,
} from 'class-validator';
import { PricingType, AuthType, RateLimit, Difficulty } from '@prisma/client';

export class CreateApiDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsUrl()
    websiteUrl: string;

    @IsUrl()
    documentationUrl: string;

    @IsOptional()
    @IsString()
    logoUrl?: string;

    @IsOptional()
    @IsString()
    providerName?: string;

    @IsEnum(PricingType)
    pricingType: PricingType;

    @IsEnum(AuthType)
    authType: AuthType;

    @IsEnum(RateLimit)
    rateLimit: RateLimit;

    @IsOptional()
    @IsBoolean()
    isOpenSource?: boolean;

    @IsOptional()
    @IsEnum(Difficulty)
    difficultyLevel?: Difficulty;

    @IsOptional()
    @IsString()
    pricingSummary?: string;

    @IsOptional()
    @IsString()
    useCases?: string;

    @IsOptional()
    @IsString()
    rateLimitInfo?: string;

    @IsOptional()
    @IsString()
    authDescription?: string;

    @IsOptional()
    @IsUrl()
    dashboardUrl?: string;

    @IsOptional()
    @IsUrl()
    pricingUrl?: string;

    @IsString()
    categoryId: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    tagIds?: string[];
}
