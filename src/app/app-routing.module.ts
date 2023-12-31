import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { NavbarComponent } from './navbar/navbar.component';
import { UsersFlowComponent } from './users-flow/users-flow.component';
import { UsersGalleryComponent } from './users-gallery/users-gallery.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { LabelsTreeComponent } from './labels-tree/labels-tree.component';

const routes: Routes = [
  { path: '', component: UsersGalleryComponent },
  { path: 'random', component: UsersFlowComponent },
  { path: 'signup', component: SignupFormComponent },
  { path: 'gallery', component: UsersGalleryComponent },
  { path: 'labels', component: LabelsTreeComponent },
  { path: 'profile', component: UserProfileComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
