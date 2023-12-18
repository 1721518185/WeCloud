import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { FileUploadComponent } from './file-upload.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NzUploadModule,
    NzSpinModule,
  ],
  declarations: [FileUploadComponent],
  exports: [FileUploadComponent],
})
export class FileUploadModule {}
