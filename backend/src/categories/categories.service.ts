// src/categories/categories.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repo: Repository<Category>,
  ) {}

  findAll() {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findOneBySlug(slug: string) {
    return this.repo.findOne({ where: { slug } });
  }

  async findOneById(id: string) {
    const category = await this.repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  create(data: Partial<Category>) {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }

  async update(id: string, data: Partial<Category>) {
    const category = await this.findOneById(id);
    Object.assign(category, data);
    return this.repo.save(category);
  }

  async remove(id: string) {
    const category = await this.findOneById(id);
    await this.repo.remove(category);
    return { deleted: true };
  }
}
