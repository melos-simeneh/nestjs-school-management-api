import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ListSchoolsDto {
  @ApiProperty({
    example: 42.3601,
    description: 'Latitude coordinate of the reference location (-90 to 90)',
    required: true,
  })
  @IsNotEmpty({ message: 'Latitude is required' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Latitude must be a valid number' },
  )
  @Transform(({ value }) => parseFloat(value as string))
  @IsLatitude({ message: 'Invalid latitude value' })
  latitude: number;

  @ApiProperty({
    example: -71.0589,
    description: 'Longitude coordinate of the reference location (-180 to 180)',
    required: true,
  })
  @IsNotEmpty({ message: 'Longitude is required' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Longitude must be a valid number' },
  )
  @Transform(({ value }) => parseFloat(value as string))
  @IsLongitude({ message: 'Invalid longitude value' })
  longitude: number;

  @ApiPropertyOptional({
    description: 'Page number (minimum: 1)',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Page must be an integer' })
  @Transform(({ value }) => parseInt(value as string, 10))
  @Min(1, { message: 'Page must be at least 1' })
  page: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (10-100)',
    default: 10,
    minimum: 10,
    maximum: 100,
  })
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer' })
  @Transform(({ value }) => parseInt(value as string, 10))
  @Min(10, { message: 'Limit must be at least 10' })
  @Max(100, { message: 'Limit cannot exceed 100' })
  limit: number = 10;
}
