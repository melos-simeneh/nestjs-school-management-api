import { Test, TestingModule } from '@nestjs/testing';
import { SchoolService } from './school.service';
import { SchoolDataService } from './school.data.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ListSchoolsDto } from './dto/list-schools.dto';

describe('SchoolService', () => {
  let service: SchoolService;
  let schoolDataService: SchoolDataService;

  beforeEach(async () => {
    const mockSchoolDataService = {
      create: jest.fn().mockImplementation((dto: CreateSchoolDto) => ({
        id: 1,
        ...dto,
      })),
      doesSchoolNameExist: jest.fn().mockReturnValue(false),
      findOneById: jest.fn().mockImplementation((id: number) => ({
        id,
        name: 'Test School',
        latitude: 0,
        longitude: 0,
      })),
      findOneByName: jest.fn().mockImplementation((name: string) => ({
        id: 1,
        name,
        latitude: 0,
        longitude: 0,
      })),
      findAll: jest
        .fn()
        .mockReturnValue([
          { id: 1, name: 'Test School', latitude: 0, longitude: 0 },
        ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SchoolService,
        { provide: SchoolDataService, useValue: mockSchoolDataService },
      ],
    }).compile();

    service = module.get<SchoolService>(SchoolService);
    schoolDataService = module.get<SchoolDataService>(SchoolDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a school', () => {
    const createSchoolDto: CreateSchoolDto = {
      name: 'Test School',
      latitude: 0,
      longitude: 0,
      address: '123 Test Street',
    };
    const result = service.createSchool(createSchoolDto);
    expect(result).toEqual({
      id: 1,
      name: 'Test School',
      latitude: 0,
      longitude: 0,
      address: '123 Test Street',
    });
    expect(schoolDataService.create).toHaveBeenCalledWith(createSchoolDto);
  });

  it('should check if school name exists', () => {
    const result = service.doesSchoolNameExist('Test School');
    expect(result).toBe(false);
    expect(schoolDataService.doesSchoolNameExist).toHaveBeenCalledWith(
      'Test School',
    );
  });

  it('should find school by ID', () => {
    const result = service.findSchoolById(1);
    expect(result).toEqual({
      id: 1,
      name: 'Test School',
      latitude: 0,
      longitude: 0,
    });
    expect(schoolDataService.findOneById).toHaveBeenCalledWith(1);
  });

  it('should find school by name', () => {
    const result = service.findSchoolByName('Test School');
    expect(result).toEqual({
      id: 1,
      name: 'Test School',
      latitude: 0,
      longitude: 0,
    });
    expect(schoolDataService.findOneByName).toHaveBeenCalledWith('Test School');
  });

  it('should list schools with pagination and distance calculation', () => {
    const listSchoolsDto: ListSchoolsDto = {
      latitude: 0,
      longitude: 0,
      page: 1,
      limit: 10,
    };
    const result = service.listSchools(listSchoolsDto);
    expect(result.schools).toHaveLength(1);
    expect(result.total).toBe(1);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.hasMore).toBe(false);
  });
});
