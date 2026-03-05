import {
    Controller,
    Get,
    Post,
    Patch,
    Param,
    Body,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { UpdateSubmissionStatusDto } from './dto/update-submission-status.dto';

@Controller('submissions')
export class SubmissionsController {
    constructor(private readonly submissionsService: SubmissionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Request() req: any,
        @Body() body: CreateSubmissionDto,
    ) {
        return this.submissionsService.create(req.user.sub, body);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    findAll(
        @Query('status') status?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.submissionsService.findAll(
            status as any,
            page ? +page : 1,
            limit ? +limit : 10,
        );
    }

    @Get('mine')
    @UseGuards(JwtAuthGuard)
    findMine(
        @Request() req: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        return this.submissionsService.findUserSubmissions(
            req.user.sub,
            page ? +page : 1,
            limit ? +limit : 20,
        );
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    updateStatus(
        @Param('id') id: string,
        @Body() body: UpdateSubmissionStatusDto,
    ) {
        return this.submissionsService.updateStatus(id, body.status, body.reviewNotes);
    }
}
