import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersFlowComponent } from './users-flow.component';

@NgModule({
  declarations: [
    UsersFlowComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    UsersFlowComponent
  ]
})
export class UsersFlowModule { }
