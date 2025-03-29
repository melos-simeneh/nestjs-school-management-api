import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolDto {
  @ApiProperty({
    example: 'Greenwood High School',
    description: 'The name of the school',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    example: '123 Education Street, Boston, MA',
    description: 'The physical address of the school',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    example: 42.3601,
    description: 'Latitude coordinate of the school location',
  })
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty({
    example: -71.0589,
    description: 'Longitude coordinate of the school location',
  })
  @IsNotEmpty()
  @IsNumber()
  longitude: number;
}
