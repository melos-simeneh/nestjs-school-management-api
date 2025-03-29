import { ApiProperty } from '@nestjs/swagger';

export class School {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the school',
  })
  id: number;

  @ApiProperty({
    example: 'Greenwood High School',
    description: 'The name of the school',
  })
  name: string;

  @ApiProperty({
    example: '123 Education Street, Boston, MA',
    description: 'The physical address of the school',
  })
  address: string;

  @ApiProperty({
    example: 42.3601,
    description: 'Latitude coordinate of the school location',
  })
  latitude: number;

  @ApiProperty({
    example: -71.0589,
    description: 'Longitude coordinate of the school location',
  })
  longitude: number;
}
