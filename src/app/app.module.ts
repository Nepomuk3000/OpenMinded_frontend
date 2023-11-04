import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';

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

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

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
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UserCardComponent } from './user-card/main/user-card.component';
import { UserButtonBarComponent } from './user-card/user-button-bar/user-button-bar.component';
import { UserDetailsComponent } from './user-card/user-details/user-details.component';
import { UserRelationshipComponent } from './user-card/user-relationship/user-relationship.component';
import { UserIdentityComponent } from './user-card/user-identity/user-identity.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UsersFlowComponent } from './users-flow/users-flow.component';
import { UsersGalleryComponent } from './users-gallery/users-gallery.component';
import { ImageUploaderComponent } from './image-uploader/image-uploader.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { LabelsTreeComponent } from './labels-tree/labels-tree.component';
import { TreeNodeComponent } from './labels-tree/tree-node/tree-node.component';
import { ImageCardComponent } from './user-card/image-card/image-card.component';
import { ChatComponent } from './chat/chat.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

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
    TreeNodeComponent,
    UserCardComponent,
    UserButtonBarComponent,
    UserDetailsComponent,
    UserRelationshipComponent,
    UserIdentityComponent,
    UsersFlowComponent,
    UsersGalleryComponent,
    ImageUploaderComponent,
    NavbarComponent,
    ImageCardComponent,
    HeaderComponent,
    FooterComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
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
    InputTextareaModule,
    InputTextModule,
    AccordionModule,
    FieldsetModule,
    ConfirmPopupModule,
    ToolbarModule,
    CardModule,
    PanelModule,
    ToastModule,


    BrowserAnimationsModule,
    AppRoutingModule,
    TranslocoRootModule
  ],
  providers: [UserService,
              {
                provide: HTTP_INTERCEPTORS,
                useClass: AuthInterceptor,
                multi: true
              },
              ConfirmationService,
              MessageService
            ],
  bootstrap: [AppComponent]
})
export class AppModule { }
