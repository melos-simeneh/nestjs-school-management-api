import { Test, TestingModule } from '@nestjs/testing';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ListSchoolsDto } from './dto/list-schools.dto';
import { ValidationPipe } from '@nestjs/common';
import { HttpException, NotFoundException } from '@nestjs/common';

describe('SchoolController', () => {
  let controller: SchoolController;
  let service: SchoolService;

  const mockSchool = {
    id: 1,
    name: 'Test School',
    address: '123 Test Street',
    latitude: 42.3601,
    longitude: -71.0589,
  };

  const mockSchoolService = {
    createSchool: jest.fn().mockReturnValue(mockSchool),
    doesSchoolNameExist: jest.fn().mockReturnValue(false),
    listSchools: jest.fn().mockReturnValue({
      schools: [mockSchool],
      total: 1,
      page: 1,
      limit: 10,
      hasMore: false,
    }),
    findSchoolByName: jest.fn().mockReturnValue(mockSchool),
    findSchoolById: jest.fn().mockReturnValue(mockSchool),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchoolController],
      providers: [
        {
          provide: SchoolService,
          useValue: mockSchoolService,
        },
      ],
    }).compile();

    controller = module.get<SchoolController>(SchoolController);
    service = module.get<SchoolService>(SchoolService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create a school', () => {
      const createDto: CreateSchoolDto = {
        name: 'Test School',
        address: '123 Test Street',
        latitude: 42.3601,
        longitude: -71.0589,
      };

      const result = controller.create(createDto);
      expect(service.doesSchoolNameExist).toHaveBeenCalledWith(createDto.name);
      expect(service.createSchool).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockSchool);
    });

    it('should throw BadRequest if school name exists', () => {
      const createDto: CreateSchoolDto = {
        name: 'Existing School',
        address: '123 Test Street',
        latitude: 42.3601,
        longitude: -71.0589,
      };

      mockSchoolService.doesSchoolNameExist.mockReturnValueOnce(true);

      expect(() => controller.create(createDto)).toThrow(HttpException);
    });

    it('should validate the input DTO', async () => {
      const invalidDto = {
        name: 'A', // too short
        address: 'Short', // too short
        latitude: 'not a number', // invalid
        longitude: 200, // out of range
      };

      const validationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
      });

      await expect(
        validationPipe.transform(invalidDto, {
          metatype: CreateSchoolDto,
          type: 'body',
        }),
      ).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated schools sorted by distance', () => {
      const listDto: ListSchoolsDto = {
        latitude: 42.3601,
        longitude: -71.0589,
        page: 1,
        limit: 10,
      };

      const result = controller.findAll(listDto);
      expect(service.listSchools).toHaveBeenCalledWith(listDto);
      expect(result).toEqual({
        schools: [mockSchool],
        total: 1,
        page: 1,
        limit: 10,
        hasMore: false,
      });
    });

    it('should throw NotFound if no schools exist', () => {
      mockSchoolService.listSchools.mockReturnValueOnce({ total: 0 });

      const listDto: ListSchoolsDto = {
        latitude: 42.3601,
        longitude: -71.0589,
        page: 1,
        limit: 10,
      };

      expect(() => controller.findAll(listDto)).toThrow(NotFoundException);
    });

    it('should validate the query DTO', async () => {
      const invalidDto = {
        latitude: 'not a number', // invalid
        longitude: 200, // out of range
        page: 0, // too small
        limit: 5, // too small
      };

      const validationPipe = new ValidationPipe({
        transform: true,
        whitelist: true,
      });

      await expect(
        validationPipe.transform(invalidDto, {
          metatype: ListSchoolsDto,
          type: 'query',
        }),
      ).rejects.toThrow();
    });
  });

  describe('findOneByName', () => {
    it('should return a school by name', () => {
      const name = 'Test School';
      const result = controller.findOneByName(name);
      expect(service.findSchoolByName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mockSchool);
    });

    it('should throw NotFound if school does not exist', () => {
      mockSchoolService.findSchoolByName.mockReturnValueOnce(null);
      const name = 'Non-existent School';
      expect(() => controller.findOneByName(name)).toThrow(NotFoundException);
    });
  });

  describe('findOne', () => {
    it('should return a school by ID', () => {
      const id = 1;
      const result = controller.findOne(id);
      expect(service.findSchoolById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockSchool);
    });

    it('should throw NotFound if school does not exist', () => {
      mockSchoolService.findSchoolById.mockReturnValueOnce(null);
      const id = 999;
      expect(() => controller.findOne(id)).toThrow(NotFoundException);
    });
  });
});
