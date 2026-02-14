import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
    constructor(private readonly feedbackService: FeedbackService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    toggle(@Request() req: any, @Body() body: CreateFeedbackDto) {
        return this.feedbackService.toggle(req.user.sub, body.apiId, body.type);
    }
}
