import { IsString, IsInt, IsOptional, Min, Max, MaxLength } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    apiId: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    @MaxLength(2000)
    comment?: string;
}
