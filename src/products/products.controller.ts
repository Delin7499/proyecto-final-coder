import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { faker } from '@faker-js/faker';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
  ) {
    page = page || '1';
    const response = await this.productsService.findAllPaginated(
      parseInt(page),
      limit,
      sort,
    );
    const nextPage = page ? parseInt(page) + 1 : 2;
    const prevPage = page ? parseInt(page) - 1 : 1;
    const nextLink = response.hasNextPage
      ? `/api/products?page=${nextPage}&limit=${limit}`
      : null;

    const prevLink = response.hasPrevPage
      ? `/api/products?page=${prevPage}&limit=${limit}`
      : null;
    return { ...response, nextLink, prevLink };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.productsService.remove(id);
    return null;
  }

  @Post('mock-products')
  async createMockProducts() {
    for (let i = 0; i < 100; i++) {
      const product = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseInt(faker.commerce.price()),
        status: true,
        stock: 100,
        category: faker.commerce.department(),
        thumbnail: faker.image.url(),
        owner: 'Admin',
      };
      await this.productsService.create(product);
    }
  }
}
