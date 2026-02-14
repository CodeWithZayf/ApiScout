import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
    UseGuards,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Get()
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get(':slug')
    async findBySlug(@Param('slug') slug: string) {
        const category = await this.categoriesService.findBySlug(slug);
        if (!category) {
            throw new NotFoundException(`Category ${slug} not found`);
        }
        return category;
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    create(@Body() body: CreateCategoryDto) {
        return this.categoriesService.create(body);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    update(@Param('id') id: string, @Body() body: UpdateCategoryDto) {
        return this.categoriesService.update(id, body);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async remove(@Param('id') id: string) {
        const category = await this.categoriesService.findById(id);
        if (!category) {
            throw new NotFoundException('Category not found');
        }
        if (category._count.apis > 0) {
            throw new ConflictException(
                `Cannot delete category with ${category._count.apis} associated API(s). Reassign them first.`,
            );
        }
        return this.categoriesService.remove(id);
    }
}
