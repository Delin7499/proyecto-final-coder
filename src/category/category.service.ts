import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './DTO/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  async create(category: CreateCategoryDto): Promise<Category> {
    const newCategory = new this.categoryModel(category);
    return newCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return this.categoryModel.find().exec();
  }

  async findOne(id: string): Promise<Category> {
    return this.categoryModel.findById(id).exec();
  }

  async update(id: string, category: CreateCategoryDto): Promise<Category> {
    const updatedCategory = await this.categoryModel
      .findByIdAndUpdate(id, category, { new: true })
      .exec();
    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return updatedCategory;
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
  }
}
