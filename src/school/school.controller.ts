import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ListSchoolsDto } from './dto/list-schools.dto';
import { School } from './school.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundException } from '@nestjs/common';

@ApiTags('schools')
@Controller('schools')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new school' })
  @ApiResponse({
    status: 201,
    description: 'The school has been successfully created.',
    type: School,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body(ValidationPipe) createSchoolDto: CreateSchoolDto): School {
    return this.schoolService.createSchool(createSchoolDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all schools sorted by proximity' })
  @ApiResponse({
    status: 200,
    description:
      'List of schools sorted by distance from the provided coordinates',
    type: [School],
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'No schools found' })
  findAll(@Query() listSchoolsDto: ListSchoolsDto): School[] {
    const schools = this.schoolService.listSchools(listSchoolsDto);

    if (schools.length === 0) {
      throw new NotFoundException('No schools found');
    }

    return schools;
  }
}
