import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MovieDetailsComponent } from './wegame-details.component';
import {UploadList} from "../uploadList/uploadList.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    UploadList,
    RouterModule.forChild([
      {
        path: '',
        component: MovieDetailsComponent,
      },
    ]),
  ],
  declarations: [MovieDetailsComponent],
  exports: [MovieDetailsComponent],
})
export class MovieDetailsModule {}
