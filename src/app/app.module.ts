import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FractalComponent } from './fractal/fractal.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { ColorsComponent } from './colors/colors.component';
//import {ImageCropperComponent} from 'ng2-img-cropper';

const appRoutes: Routes = [
  { path: 'mandelbrot', component: FractalComponent }
];

@NgModule({
  declarations: [
    FractalComponent,
    NavComponent,
    FooterComponent,
    ColorsComponent,
    //ImageCropperComponent
  ],
  imports: [
    NgbModule.forRoot(),
    RouterModule.forRoot(appRoutes),
    BrowserModule, HttpClientModule, FormsModule
  ],
  providers: [],
//  bootstrap: [AppComponent, CanvasComponent]
  bootstrap: [FractalComponent]
})
export class AppModule { }
