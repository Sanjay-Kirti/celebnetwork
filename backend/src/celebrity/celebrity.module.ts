import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Celebrity } from './celebrity.entity';
import { CelebrityService } from './celebrity.service';
import { CelebrityController } from './celebrity.controller';
import { FanController } from './fan.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Celebrity, User])],
  providers: [CelebrityService],
  controllers: [CelebrityController, FanController]
})
export class CelebrityModule {}
