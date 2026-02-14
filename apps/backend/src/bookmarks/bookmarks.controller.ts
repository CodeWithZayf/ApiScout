import {
    Controller,
    Get,
    Post,
    Param,
    Query,
    UseGuards,
    Request,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    findAll(@Request() req: any, @Query('page') page?: string, @Query('limit') limit?: string) {
        return this.bookmarksService.findUserBookmarks(
            req.user.sub,
            page ? +page : 1,
            limit ? +limit : 12,
        );
    }

    @Post(':apiId')
    @UseGuards(JwtAuthGuard)
    toggle(@Param('apiId') apiId: string, @Request() req: any) {
        return this.bookmarksService.toggle(req.user.sub, apiId);
    }

    @Get(':apiId/status')
    @UseGuards(JwtAuthGuard)
    isBookmarked(@Param('apiId') apiId: string, @Request() req: any) {
        return this.bookmarksService.isBookmarked(req.user.sub, apiId);
    }
}
