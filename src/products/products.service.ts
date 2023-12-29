import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { nanoid } from 'nanoid';
import { PaginationResponse } from 'src/common/interfaces/pagination-response.interface';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(product: CreateProductDto): Promise<Product> {
    const newProduct = new this.productModel({
      ...product,
      code: nanoid(8),
    });
    return newProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return this.productModel.find().exec();
  }

  async findAllPaginated(
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginationResponse<Product>> {
    const totalDocs = await this.productModel.countDocuments();
    const payload = await this.productModel
      .find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('category')
      .exec();

    const totalPages = Math.ceil(totalDocs / limit);
    const pagingCounter = (page - 1) * limit + 1;
    const hasPrevPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
      payload,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter,
      hasPrevPage,
      hasNextPage,
    };
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('category')
      .exec();
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .populate('category')
      .exec();
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
