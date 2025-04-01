import { Injectable } from '@nestjs/common';
import { SchoolDataService } from './school.data.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { ListSchoolsDto } from './dto/list-schools.dto';
import { School } from './school.entity';

@Injectable()
export class SchoolService {
  constructor(private readonly schoolDataService: SchoolDataService) {}

  createSchool(createSchoolDto: CreateSchoolDto): School {
    return this.schoolDataService.create(createSchoolDto);
  }

  doesSchoolNameExist(name: string): boolean {
    return this.schoolDataService.doesSchoolNameExist(name);
  }

  listSchools(listSchoolsDto: ListSchoolsDto): {
    schools: School[];
    total: number;
    page: number;
    limit: number;
  } {
    const { latitude, longitude, page, limit } = listSchoolsDto;
    const schools = this.schoolDataService.findAll();

    const schoolsWithDistance = schools
      .map((school) => ({
        ...school,
        distance: this.calculateDistance(
          latitude,
          longitude,
          school.latitude,
          school.longitude,
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedSchools = schoolsWithDistance.slice(startIndex, endIndex);

    return {
      schools: paginatedSchools,
      total: schools.length,
      page,
      limit,
    };
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
