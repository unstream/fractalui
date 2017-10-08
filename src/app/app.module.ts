import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FractalComponent } from './fractal/fractal.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    FractalComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, FormsModule
  ],
  providers: [],
//  bootstrap: [AppComponent, CanvasComponent]
  bootstrap: [FractalComponent]
})
export class AppModule { }
