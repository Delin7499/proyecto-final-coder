import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Param,
  Body,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './DTO/create-product.dto';
import { UpdateProductDto } from './DTO/update-product.dto';
import { faker } from '@faker-js/faker';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';

const productsStorage = diskStorage({
  destination: (req: Request, file, cb) => {
    const user = req.user['user'];
    const userId = user._id;
    const userName = user.first_name.replace(/ /g, '_');

    const path = `./public/products/${userName}-${userId}`;
    if (!existsSync(path)) {
      mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${name}-${randomName}${extension}`);
  },
});

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(
    FileInterceptor('thumbnailFile', { storage: productsStorage }),
  )
  async create(
    @Req() request: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const owner = request.user['user'].email;
    console.log('llego peticion');
    console.log('body', request.body);
    console.log('file', file);
    let thumbnail = 'default';

    if (request.body.thumbnailType === 'URL') {
      thumbnail = request.body.thumbnailURL;
    } else if (file) {
      thumbnail = file.path.replace('public', '');
    }

    const productData = {
      title: request.body.title,
      description: request.body.description,
      price: request.body.price,
      status: request.body.status === 'Visible' ? true : false,
      stock: request.body.stock,
      category: request.body.category,
      thumbnail,
      owner,
      barcode: request.body.barcode,
    };
    const product = await this.productsService.create(productData);
    return { message: 'Request recived', product };
  }

  @Get()
  async findAll(
    @Query('page') page: string,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
  ) {
    page = page || '1';
    limit = limit || 10;
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

  @Get('user/:owner')
  async findAllByOwner(
    @Query('page') page: string,
    @Query('limit') limit: number,
    @Query('sort') sort: string,
    @Param('owner') owner: string,
  ) {
    page = page || '1';
    limit = limit || 10;
    const response = await this.productsService.findAllPaginatedByOwner(
      parseInt(page),
      limit,
      sort,
      owner,
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
