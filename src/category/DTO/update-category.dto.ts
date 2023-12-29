import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  thumbnail: string;
  @ApiProperty()
  owner: string;
}
