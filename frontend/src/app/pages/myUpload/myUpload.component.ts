import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NavigateService } from 'src/app/services/navigate.service';
import { ApiService } from 'src/app/services/api.service';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-favorite',
  templateUrl: './myUpload.html',
  styleUrls: ['./myUpload.scss'],
})
export class MyUploadComponent implements OnInit {
  favoriteList: any = [];
  loading: boolean = true;
  username: any;
  images: {
    url: any,
     type: any,
     uploadTime:any,
     blobUrl:any ,
     picTitle:any
    }[] = [];
  // Azure Storage SAS URL
  sasUrl = 'https://wecloudblob.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-12-18T18:13:02Z&st=2023-12-18T10:13:02Z&spr=https,http&sig=pMEPhuudBIztt%2FjWBY%2BWIeGqWHN6BdYMAzUmGSy7PUU%3D';
  containerName = 'games';
  constructor(
    private apiService: ApiService,
    private $message: NzMessageService,
    private navigateService: NavigateService,
    private http: HttpClient,
    private  modalService: NzModalService

  ) {}

  ngOnInit() {
    this.username = localStorage.getItem('username') as any;
  }

  previewImage(image: { url: string, type: string }) {
    let content = '';
    if (image.type.startsWith('image')) {
      content = `<img src="${image.url}" alt="Image" style="width: 100%; max-height: 600px;">`;
    } else if (image.type.startsWith('video')) {
      content = `<video src="${image.url}" controls style="width: 100%; max-height: 600px;"></video>`;
    }else if (image.type.startsWith('audio')) {
      content = `<audio src="${image.url}" controls style="width: 100%; max-height: 600px;"></video>`;
    }
    else {
      // Handle other types as needed
    }
    this.modalService.create({
      nzTitle: 'Preview',
      nzContent: content,
      nzFooter: null
    });
  }

  downloadImage(url: string) {
    window.location.href = url;
  }

  async deleteImage(index: number) {
    const image = this.images[index];
    const blobUrl = image.blobUrl;
    const xmsVersion = '2022-11-02';

    const headers = new HttpHeaders({
      'x-ms-date': new Date().toUTCString(),
      'x-ms-version': xmsVersion
    });

    try {
      await this.http.delete(blobUrl, { headers }).toPromise();
      //refresh the page
      this.images.splice(index, 1);
    } catch (error) {
      console.error('Failed to delete blob:', error);
    }
  }
}
