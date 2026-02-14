import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Query,
    Body,
    UseGuards,
} from '@nestjs/common';
import { ApisService } from './apis.service';
import { QueryApisDto } from './dto/query-apis.dto';
import { CreateApiDto } from './dto/create-api.dto';
import { UpdateApiDto } from './dto/update-api.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('apis')
export class ApisController {
    constructor(private readonly apisService: ApisService) { }

    @Get()
    findAll(@Query() query: QueryApisDto) {
        return this.apisService.findAll(query);
    }

    @Get('trending')
    findTrending(@Query('limit') limit?: number) {
        return this.apisService.findTrending(limit ? +limit : 6);
    }

    @Get('featured')
    findFeatured(@Query('limit') limit?: number) {
        return this.apisService.findFeatured(limit ? +limit : 6);
    }

    @Get('compare')
    compare(@Query('slugs') slugs?: string) {
        if (!slugs) return [];
        const slugArray = slugs.split(',').filter(Boolean).slice(0, 4);
        return this.apisService.compare(slugArray);
    }

    @Get(':slug')
    findBySlug(@Param('slug') slug: string) {
        return this.apisService.findBySlug(slug);
    }

    @Post(':slug/view')
    incrementView(@Param('slug') slug: string) {
        return this.apisService.incrementView(slug);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() dto: CreateApiDto) {
        return this.apisService.create(dto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(@Param('id') id: string, @Body() dto: UpdateApiDto) {
        return this.apisService.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    remove(@Param('id') id: string) {
        return this.apisService.remove(id);
    }
}
