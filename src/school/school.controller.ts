import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ListSchoolsDto } from './dto/list-schools.dto';
import { School } from './school.entity';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
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
    const doesSchoolNameExist = this.schoolService.doesSchoolNameExist(
      createSchoolDto.name,
    );
    if (doesSchoolNameExist) {
      throw new HttpException(
        'School name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.schoolService.createSchool(createSchoolDto);
  }

  @Get()
  @ApiOperation({
    summary: 'List all schools sorted by proximity with pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of schools sorted by distance',
    schema: {
      type: 'object',
      properties: {
        schools: { type: 'array', items: { $ref: getSchemaPath(School) } },
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        hasMore: { type: 'boolean', default: false },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 404, description: 'No schools found' })
  findAll(@Query() listSchoolsDto: ListSchoolsDto) {
    const result = this.schoolService.listSchools(listSchoolsDto);
    if (result.total === 0) {
      throw new NotFoundException('No schools found');
    }
    return result;
  }
  @Get('find')
  @ApiOperation({ summary: 'Retrieve a specific school by Name' })
  @ApiResponse({
    status: 200,
    description: 'The school was successfully retrieved.',
    type: School,
  })
  @ApiResponse({ status: 404, description: 'School not found' })
  findOneByName(@Query('name') name: string): School {
    const school = this.schoolService.findSchoolByName(name);
    if (!school) {
      throw new NotFoundException(`School with Name ${name} not found`);
    }
    return school;
  }
  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a specific school by ID' })
  @ApiResponse({
    status: 200,
    description: 'The school was successfully retrieved.',
    type: School,
  })
  @ApiResponse({ status: 404, description: 'School not found' })
  findOne(@Param('id') id: number): School {
    const school = this.schoolService.findSchoolById(id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }
}
