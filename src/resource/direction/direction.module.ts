import { Module } from '@nestjs/common';
import { DirectionService } from './direction.service';
import { DirectionController } from './direction.controller';
import { FileUploadModule } from 'src/file/file-upload.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [DirectionController],
  providers: [DirectionService],
  imports: [AuthModule, FileUploadModule],
})
export class DirectionModule {}
