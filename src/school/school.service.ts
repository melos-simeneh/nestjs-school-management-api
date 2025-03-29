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

  listSchools(listSchoolsDto: ListSchoolsDto): School[] {
    const { latitude, longitude } = listSchoolsDto;
    const schools = this.schoolDataService.findAll();

    return schools
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
