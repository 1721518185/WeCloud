import {Component, Input, OnInit} from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { NzModalService } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() uniqueGameName: string | '' | undefined;
  uploading = false;
  fileList: NzUploadFile[] = [];
  uploadTitle = '';
  sasUrl = 'https://wecloudblob.blob.core.windows.net/games?si=all&sv=2022-11-02&sr=c&sig=YU%2BMkvJqCF8%2FKQkAH2orl8%2FVzHWhUpZydluUfHfFZK0%3D';
  containerName = 'games';
  blobServiceClient: BlobServiceClient;
  containerClient: ContainerClient;

  constructor(private $message: NzMessageService, private modalService: NzModalService) {
    this.blobServiceClient = new BlobServiceClient(this.sasUrl);
    this.containerClient = this.blobServiceClient.getContainerClient(this.containerName);
  }

  ngOnInit(): void {
    // Additional initialization logic if required
  }

  // Handle the file before uploading
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    this.fileList = this.fileList.concat(file);
    return false; // Prevent automatic upload
  };

  handleUpload(): void {
     if (!this.uniqueGameName || this.uniqueGameName.trim() === '') {
        this.$message.warning('Please select the media name before uploading.');
        return;
      }

    this.modalService.confirm({
      nzTitle: 'Please Confirm Your Upload',
      nzContent: `Title: ${this.uploadTitle}<br/>Number of files: ${this.fileList.length}`,
      nzOnOk: () => this.onConfirmUpload()
    });
  }

  async onConfirmUpload() {
    this.uploading = true;
    for (const file of this.fileList) {
      const blob = new Blob([file as any], { type: file.type });
      await this.uploadFileToAzure(this.uploadTitle, file.name, blob);
    }
    this.uploadTitle = '';
    this.fileList = [];
    this.uploading = false;
  }

  handleChange({ file, fileList }: NzUploadChangeParam): void {
    const status = file.status;
    if (status === 'done') {
      this.$message.success(`${file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      this.$message.error(`${file.name} file upload failed.`);
    }
    this.fileList = fileList;
  }

  async uploadFileToAzure(uploadTitle: string, fileName: string, blob: Blob) {
    try {
      const username = localStorage.getItem('username') as any;
      const newFileName = `${uploadTitle}_${username}_${this.uniqueGameName}_${fileName}`;
      const blockBlobClient = this.containerClient.getBlockBlobClient(newFileName);
      await blockBlobClient.uploadData(blob);
      this.$message.success(`${fileName} uploaded successfully.`);
    } catch (error) {
      this.$message.error(`Upload failed: ${error}`);
    }
  }
}
