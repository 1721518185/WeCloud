import { Component, OnInit, Input } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ApiService } from 'src/app/services/api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-my-upload',
  templateUrl: './uploadList.html',
  styleUrls: ['./uploadList.scss']
})
export class MyUploadComponent implements OnInit {
  @Input() filterCriteria: string | '' | undefined;

  favoriteList: any = [];
  loading: boolean = true;
  username: any;
  images: {
    url: any,
    type: any,
    uploadTime: any,
    blobUrl: any,
    picTitle: any
  }[] = [];
  sasUrl = 'https://wecloudblob.blob.core.windows.net/games?si=all&sv=2022-11-02&sr=c&sig=YU%2BMkvJqCF8%2FKQkAH2orl8%2FVzHWhUpZydluUfHfFZK0%3D'
  containerName = 'games';

  constructor(
    private apiService: ApiService,
    private $message: NzMessageService,
    private http: HttpClient,
    private modalService: NzModalService
  ) {}

  ngOnInit() {
    console.log('filterCriteria!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log(this.filterCriteria);
    this.username = localStorage.getItem('username') as any;
    this.loadImagesFromAzure();
  }

  private extractSasToken(): string {
    const sasToken = this.sasUrl.split('?')[1];
    return sasToken ? `?${sasToken}` : '';
  }

  previewImage(image: { url: string, type: string }) {
    let content = '';
    if (image.type.startsWith('image')) {
      content = `<img src="${image.url}" alt="Image" style="width: 100%; max-height: 600px;">`;
    } else if (image.type.startsWith('video')) {
      content = `<video src="${image.url}" controls style="width: 100%; max-height: 600px;"></video>`;
    } else if (image.type.startsWith('audio')) {
      content = `<audio src="${image.url}" controls style="width: 100%; max-height: 600px;"></audio>`;
    } else {
      // Handle other types as needed
    }
    this.modalService.create({
      nzTitle: 'Preview',
      nzContent: content,
      nzFooter: null,
      nzWidth: '80%'
    });
  }

  downloadImage(url: string) {
    window.location.href = url;
  }

  async deleteImage(index: number) {
    const image = this.images[index];
    const blobUrl = image.blobUrl;

    const headers = new HttpHeaders({
      'x-ms-date': new Date().toUTCString(),
      'x-ms-version': '2022-11-02'
    });

    try {
      await this.http.delete(blobUrl, { headers }).toPromise();
      this.images.splice(index, 1);
    } catch (error) {
      console.error('Failed to delete blob:', error);
    }
  }

  async loadImagesFromAzure() {
    const containerUrl = 'https://wecloudblob.blob.core.windows.net/games';
    const query = '?restype=container&comp=list';
    const fullUrl = `${containerUrl}${query}`;
    let filter = this.filterCriteria
    if (this.filterCriteria==='username'){
      filter = this.username;
    }
    try {
      const response = await lastValueFrom(this.http.get(fullUrl, { responseType: 'text' }));
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response, 'text/xml');
      const blobs = xmlDoc.getElementsByTagName('Blob');

      this.images = [];
      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        const name = blob.getElementsByTagName('Name')[0].textContent || '';
        const lastModified = blob.getElementsByTagName('Last-Modified')[0].textContent || '';

        if (!name || (filter && !name.includes(filter))) {
          continue;
        }

        const url = blob.getElementsByTagName('Url')[0].textContent || '';
        const blobUrl = `${containerUrl}/${name}${this.extractSasToken()}`;
        const picTitle = name.split('_')[0].replace(`${this.containerName}/`, '');

        this.images.push({
          url: url,
          type: 'image/jpeg',
          uploadTime: lastModified,
          blobUrl: blobUrl,
          picTitle: picTitle
        });
      }
    } catch (error) {
      console.error('Error fetching blobs:', error);
    }
  }
}
