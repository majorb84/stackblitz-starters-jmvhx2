import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClient,
  HttpClientModule,
  HttpClientJsonpModule,
} from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { IconsModule } from '@progress/kendo-angular-icons';
import { GridModule } from '@progress/kendo-angular-grid';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { AppComponent } from './app.component';
import { EditService } from './edit.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    HttpClientJsonpModule,
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    GridModule,
    FormsModule,
    InputsModule,
    LabelModule,
    ButtonsModule,
    IconsModule,
    LayoutModule,
    DropDownsModule,
  ],
  providers: [
    {
      deps: [HttpClient],
      provide: EditService,
      useFactory: (jsonp: HttpClient) => () => new EditService(jsonp),
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
