import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
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

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit: number = 10;
}
