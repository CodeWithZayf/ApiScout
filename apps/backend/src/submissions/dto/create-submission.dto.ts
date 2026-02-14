import { IsString, IsUrl, IsOptional, MaxLength, MinLength } from 'class-validator';

export class CreateSubmissionDto {
    @IsString()
    @MinLength(2)
    @MaxLength(100)
    name: string;

    @IsUrl()
    websiteUrl: string;

    @IsUrl()
    documentationUrl: string;

    @IsString()
    @MinLength(10)
    @MaxLength(2000)
    description: string;

    @IsString()
    @MinLength(2)
    @MaxLength(100)
    categoryName: string;

    @IsOptional()
    @IsString()
    @MaxLength(200)
    providerContact?: string;
}
