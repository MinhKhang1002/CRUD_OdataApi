import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';

import { PeopleListComponent } from './people-list/people-list.component';
import { PeopleFormComponent } from './people-form/people-form.component';
import { UsernameValidator } from './validators/async-username.validator';

@NgModule({
  declarations: [AppComponent, PeopleFormComponent, PeopleListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenubarModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SplitButtonModule,
    ToastModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [UsernameValidator],
  bootstrap: [AppComponent],
})
export class AppModule {}
