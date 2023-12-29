import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  thumbnail: string;
  @ApiProperty()
  owner: string;
}
