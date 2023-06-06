import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { serverUrl } from 'src/config';

@Component({
  selector: 'app-image-uploader',
  templateUrl: './image-uploader.component.html',
  styleUrls: ['./image-uploader.component.scss']
})
export class ImageUploaderComponent {
  @Input() userId: string | null = null;
  selectedFile: File | null = null;

  constructor(private http: HttpClient) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadImage() {
    if (this.selectedFile && this.userId) {
      const uploadUrl = serverUrl + `/api/user/${this.userId}/upload-image`;
      const formData: FormData = new FormData();
      formData.append('image', this.selectedFile, this.selectedFile.name);

      this.http.post(uploadUrl, formData).subscribe(
        (response) => {
          console.log('Image uploaded successfully', response);
        },
        (error) => {
          console.error('Error uploading image', error);
        }
      );
    }
  }
  
}
