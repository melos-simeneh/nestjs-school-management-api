import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ListSchoolsDto {
  @ApiProperty({
    example: 42.3601,
    description: 'Latitude coordinate of the reference location',
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value as string))
  @IsLatitude()
  latitude: number;

  @ApiProperty({
    example: -71.0589,
    description: 'Longitude coordinate of the reference location',
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseFloat(value as string))
  @IsLongitude()
  longitude: number;

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  @Min(1)
  page: number = 1;

  @ApiProperty({ required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value as string, 10))
  @Min(10)
  limit: number = 10;
}
