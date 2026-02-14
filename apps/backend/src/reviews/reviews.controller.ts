import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Body,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Get()
    findByApi(
        @Query('apiId') apiId: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.reviewsService.findByApi(
            apiId,
            page ? +page : 1,
            limit ? +limit : 10,
        );
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Request() req: any,
        @Body() body: CreateReviewDto,
    ) {
        return this.reviewsService.create(
            req.user.sub,
            body.apiId,
            body.rating,
            body.comment,
        );
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string, @Request() req: any) {
        return this.reviewsService.remove(id, req.user.sub);
    }
}
