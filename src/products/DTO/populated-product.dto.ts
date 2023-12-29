import { ApiProperty } from '@nestjs/swagger';
import { Category } from 'src/category/schemas/category.schema';

export class PopulatedProductDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  code: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  stock: number;
  @ApiProperty()
  category: Category;
  @ApiProperty()
  thumbnail: string;
  @ApiProperty()
  owner: string;
}
