import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MyUploadComponent } from './myUpload.component';
import {UploadList} from "../uploadList/uploadList.module";
// import {FormatTimePipe} from "../../../pipe/formatTime.pipe";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UploadList,
    RouterModule.forChild([
      {
        path: '',
        component: MyUploadComponent,
      },
    ]),
  ],
  declarations: [MyUploadComponent],
  exports: [MyUploadComponent],
})
export class MyUploadModule {}
