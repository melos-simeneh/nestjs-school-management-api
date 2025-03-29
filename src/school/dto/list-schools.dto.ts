import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ListSchoolsDto {
  @ApiProperty({
    example: 42.3601,
    description: 'Latitude coordinate of the reference location',
  })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: -71.0589,
    description: 'Longitude coordinate of the reference location',
  })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
