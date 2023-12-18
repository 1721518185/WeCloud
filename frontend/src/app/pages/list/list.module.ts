import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ListComponent } from './list.component';
import { FileUploadModule } from '../FileUploadComponent/file-upload.module';
import { NzSelectModule } from 'ng-zorro-antd/select'

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FileUploadModule,
    NzSelectModule,
    RouterModule.forChild([
      {
        path: '',
        component: ListComponent,
      },
    ]),
  ],
  declarations: [ListComponent],
  exports: [ListComponent],
})
export class ListModule {}
