import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { School } from './school.entity';
import { CreateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolDataService {
  private readonly dataPath = path.join(__dirname, '..', '..', 'data.json');

  constructor() {
    this.initializeDataFile();
  }

  private initializeDataFile(): void {
    if (!fs.existsSync(this.dataPath)) {
      fs.writeFileSync(this.dataPath, JSON.stringify([]));
    }
  }

  private readData(): School[] {
    const rawData = fs.readFileSync(this.dataPath, 'utf8');
    return JSON.parse(rawData) as School[];
  }

  private writeData(data: School[]): void {
    fs.writeFileSync(this.dataPath, JSON.stringify(data, null, 2));
  }

  findAll(): School[] {
    return this.readData();
  }

  doesSchoolNameExist(name: string): boolean {
    const schools = this.readData();
    return schools.some((school) => school.name === name);
  }

  findOneById(id: number): School | undefined {
    const schools = this.readData();
    return schools.find((school) => school.id === id);
  }
  findOneByName(name: string): School | undefined {
    const schools = this.readData();
    return schools.find((school) => school.name === name);
  }
  create(schoolDto: CreateSchoolDto): School {
    const schools = this.readData();

    const newSchool: School = {
      id: schools.length > 0 ? Math.max(...schools.map((s) => s.id)) + 1 : 1,
      ...schoolDto,
    };
    schools.push(newSchool);
    this.writeData(schools);
    return newSchool;
  }
}
