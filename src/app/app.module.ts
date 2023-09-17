import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {AutosizeModule} from 'ngx-autosize';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';

import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { TabViewModule } from 'primeng/tabview';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { FieldsetModule } from 'primeng/fieldset';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToolbarModule } from 'primeng/toolbar';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UserCardComponent } from './user-card/main/user-card.component';
import { UserButtonBarComponent } from './user-card/user-button-bar/user-button-bar.component';
import { UserDetailsComponent } from './user-card/user-details/user-details.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UsersFlowComponent } from './users-flow/users-flow.component';
import { UsersGalleryComponent } from './users-gallery/users-gallery.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { LabelsTreeComponent } from './labels-tree/labels-tree.component';
import { ImageCardComponent } from './image-card/image-card.component';
import { ChatComponent } from './chat/chat.component';

import { AppRoutingModule } from './app-routing.module';
import { TranslocoRootModule } from './transloco-root.module';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { UserService } from '../services/user.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    UserProfileComponent,
    SignupFormComponent,
    LabelsTreeComponent,
    UserCardComponent,
    UserButtonBarComponent,
    UserDetailsComponent,
    UsersFlowComponent,
    UsersGalleryComponent,
    ImageUploaderComponent,
    NavbarComponent,
    ImageCardComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AutosizeModule,
    FontAwesomeModule,
    
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatMenuModule,

    TreeModule,
    TreeTableModule,
    TabViewModule,
    ButtonModule,
    InputNumberModule,

    BrowserAnimationsModule,
    AppRoutingModule,
    TranslocoRootModule
  ],
  providers: [UserService,
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true
              }
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
