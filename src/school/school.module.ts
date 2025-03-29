import { Module } from '@nestjs/common';
import { SchoolController } from './school.controller';
import { SchoolService } from './school.service';
import { SchoolDataService } from './school.data.service';

@Module({
  controllers: [SchoolController],
  providers: [SchoolService, SchoolDataService],
})
export class SchoolModule {}
