import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FetchService } from '../../../services/fetch.service';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-add-edit',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe, RouterLink, RouterOutlet],
  templateUrl: './add-edit.component.html',
  styleUrl: './add-edit.component.css',
})
export class AddEditComponent implements OnInit {
  pageName: string = '';
  submitDisabled: boolean = false;
  movieForm: FormGroup;
  img_blob: any;
  img: any;
  movieId: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private domSanitizer: DomSanitizer,
    private fetchService: FetchService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.pageName = this.activatedRoute.snapshot.url[0]?.path;
    this.movieForm = this.fb.group({
      title: ['', [Validators.required]],
      published_year: [
        '',
        [Validators.required, Validators.pattern(/[0-9]{4}/)],
      ],
      image_file: [null],
    });
  }

  ngOnInit(): void {
    const movieId = this.activatedRoute.snapshot.paramMap.get('id');
    if (movieId) {
      this.movieId = movieId;

      this.fetchService
        .getSingleMovie(this.movieId)
        .subscribe((response: any) => {
          if (response) {
            this.movieForm.setValue({
              title: response.movie_title,
              published_year: response.movie_published_year,
              image_file: '',
            });
            this.img_blob = `${environment.BACKEND_API_CALL_URL}/uploads/movie_1714560472557.jpg`;
          }
        });
    }
  }

  get title() {
    return this.movieForm.get('title');
  }

  get published_year() {
    return this.movieForm.get('published_year');
  }

  get image_file() {
    return this.movieForm.get('image_file');
  }

  submitForm() {
    if(this.img == undefined){
      this.toastr.error("Image file is required");
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title?.value);
    formData.append('published_year', this.published_year?.value);
    formData.append('img', this.img);


    this.fetchService.storeMovie(formData).subscribe({
      next: (response) => {
        if (response._id) {
          this.toastr.success('Wohoooooo, Movie created!!!!!!!');
          this.movieForm.reset();
          this.router.navigateByUrl('/');
        }
      },
      error: (error) => {
        this.toastr.error(error.error.message)
      }
    });
  }

  changeImage(e: any) {
    const imageFile = e.target.files[0];
    this.img_blob = this.domSanitizer.bypassSecurityTrustResourceUrl(
      URL.createObjectURL(imageFile)
    );
    this.img_blob = this.img_blob.changingThisBreaksApplicationSecurity;
    this.img = imageFile;
  }

  reset() {
    this.movieForm.patchValue({
      image_file: '',
    });
    this.img_blob = '';
    this.img = '';
  }

  onDrop(e: any) {
    e.preventDefault();
    if (e.dataTransfer.items) {
      let item = e.dataTransfer.items[0];
      if (item.kind === 'file') {
        const imageFile = item.getAsFile();
        if (imageFile) {
          this.img_blob = this.domSanitizer.bypassSecurityTrustResourceUrl(
            URL.createObjectURL(imageFile)
          );
          this.img_blob = this.img_blob.changingThisBreaksApplicationSecurity;
          this.img = imageFile;
        }
      }
    }
  }

  onDragOver(e: any){
    e.preventDefault()
  }
}
