import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersFlowComponent } from './users-flow.component';
import { UserCardComponent } from '../user-card/user-card.component';

@NgModule({
  declarations: [
    UsersFlowComponent,
    UserCardComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UsersFlowComponent
  ]
})
export class UsersFlowModule { }
