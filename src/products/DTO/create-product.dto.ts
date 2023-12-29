import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  title: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  status: boolean;
  @ApiProperty()
  stock: number;
  @ApiProperty()
  category: string;
  @ApiProperty()
  thumbnail: string;
  @ApiProperty()
  owner: string;
}
