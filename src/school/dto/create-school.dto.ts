import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsLatitude,
  IsLongitude,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateSchoolDto {
  @ApiProperty({
    example: 'Greenwood High School',
    description: 'The name of the school (3-100 characters)',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty({ message: 'School name is required' })
  @IsString({ message: 'School name must be a string' })
  @MinLength(3, { message: 'School name must be at least 3 characters' })
  @MaxLength(100, { message: 'School name cannot exceed 100 characters' })
  @Transform(({ value }: { value: string }) => value?.trim())
  name: string;

  @ApiProperty({
    example: '123 Education Street, Boston, MA',
    description: 'The physical address of the school (10-255 characters)',
    minLength: 10,
    maxLength: 255,
  })
  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  @MinLength(10, { message: 'Address must be at least 10 characters' })
  @MaxLength(255, { message: 'Address cannot exceed 255 characters' })
  @Transform(({ value }: { value: string }) => value?.trim())
  address: string;

  @ApiProperty({
    example: 42.3601,
    description: 'Latitude coordinate of the school location (-90 to 90)',
  })
  @IsNotEmpty({ message: 'Latitude is required' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Latitude must be a valid number' },
  )
  @Transform(({ value }) => parseFloat(value as string))
  @IsLatitude({ message: 'Invalid latitude value (-90 to 90)' })
  latitude: number;

  @ApiProperty({
    example: -71.0589,
    description: 'Longitude coordinate of the school location (-180 to 180)',
  })
  @IsNotEmpty({ message: 'Longitude is required' })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Longitude must be a valid number' },
  )
  @Transform(({ value }) => parseFloat(value as string))
  @IsLongitude({ message: 'Invalid longitude value (-180 to 180)' })
  longitude: number;
}
