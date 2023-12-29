import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto {
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
  category: string;
  @ApiProperty()
  thumbnail: string;
  @ApiProperty()
  owner: string;
}
