import {AfterViewInit, Component, OnInit, ViewChild, HostListener} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {Fractal} from './fractal';
import {ImageCropperComponent, CropperSettings} from 'ng2-img-cropper';


//import {HostListener} from "@angular/core";

@Component({
  selector: `fractal-app`,
  templateUrl: './fractal.component.html',
  styleUrls: ['./fractal.component.css']
})

export class FractalComponent implements AfterViewInit, OnInit {
  static readonly SQRT075 = Math.sqrt(0.75);

  iterations = 100;
  maxIterations = 100;


  color = "#ff6b09";
  color2 = "#ffad20";

  model = new Fractal(-1.5, -1, 0.5, 1, 100, 0.1);
  last;

  context: CanvasRenderingContext2D;

  @ViewChild("myCanvas") myCanvas;


  data: number[][];

  cropData: any;
  cropperSettings: CropperSettings;

  // private last: MouseEvent;
  // private mouseDown : boolean = false;
  // @HostListener('mouseup')
  // onMouseup() {
  //     this.mouseDown = false;
  // }
  // @HostListener('mousemove', ['$event'])
  // onMousemove(event: MouseEvent) {
  //     if(this.mouseDown) {
  //        console.log('' + (event.clientX - this.last.clientX));
  //        this.last = event;
  //     }
  //   }
  // @HostListener('mousedown', ['$event'])
  // onMousedown(event) {
  //       this.mouseDown = true;
  //       this.last = event;
  //   }

  constructor(private http: HttpClient) {

    this.cropperSettings = new CropperSettings();
    this.cropperSettings.width = 250;
    this.cropperSettings.height = 250;
    this.cropperSettings.croppedWidth = 250;
    this.cropperSettings.croppedHeight = 250;
    this.cropperSettings.canvasWidth = 500;
    this.cropperSettings.canvasHeight = 500;
    this.cropperSettings.noFileInput = true;
    this.cropData = {};

  }


  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext("2d");
  }

  onSubmit(f: NgForm) {
    this.model = f.form.value;
    this.ngOnInit();
  }

  clicked(event) {
    this.last = { ...this.model };
    let wx = this.model.c1 - this.model.c0;
    let wy = this.model.c1i - this.model.c0i;
    let cx = this.model.c0 + wx * (event.offsetX / 500.0);
    let cy = this.model.c0i + wx * (event.offsetY / 500.0);
    this.model.c0 = cx - wx / 4;
    this.model.c0i = cy - wy / 4;
    this.model.c1 = cx + wx / 4;
    this.model.c1i = cy + wy / 4;
    this.showSelectedArea();
    this.ngOnInit();
  }

  gotoLast() {
    this.model = this.last;
    this.ngOnInit();
  }

  interpolateColor(color1: string, color2: string, interpolation: number): string {
    if (isNaN(interpolation)) {
      interpolation = 0.5;
    }
    let i = interpolation;
    let j = 1 - i;
    let r = Math.floor((j * parseInt(color1.substr(1, 2), 16)
      + i * parseInt(color2.substr(1, 2), 16)));
    let g = Math.floor((j * parseInt(color1.substr(3, 2), 16)
      + i * parseInt(color2.substr(3, 2), 16)));
    let b = Math.floor((j * parseInt(color1.substr(5, 2), 16)
      + i * parseInt(color2.substr(5, 2), 16)));
    let color: string = "#"
      + this.pad(r.toString(16), 2)
      + this.pad(g.toString(16), 2)
      + this.pad(b.toString(16), 2);
    return color;
  }

  pad(num, size): string {
    let s = num + "";
    while (s.length < size) {
      s = "0" + s;
    }
    return s;
  }

  ngOnInit(): void {
    let params = new HttpParams()
      .set("c0", '' + this.model.c0)
      .set("c0i", '' + this.model.c0i)
      .set("c1", '' + this.model.c1)
      .set("c1i", '' + this.model.c1i)
      .set("minIterations", '' + this.model.minIterations)
      .set("threshold", '' + this.model.threshold);
    //  .set("iterations", '' + this.model.maxIterations);
    this.http.get<LongQuad>('http://192.168.99.100:80/fractalservice/api/fractal/longquad', { params }).subscribe(data => {
      this.data = data.data;
      let max = 0;
      for (let x = 0; x < 500; x++) {
        for (let y = 0; y < 500; y++) {
          if (this.data[x][y] > max) {
            max = this.data[x][y];
          }
        }
      }
      this.iterations = max;
      this.maxIterations = max;
      console.log("draw");
      this.draw();
    });
  }

  draw() {
    let ctx = this.context;
    ctx.fillStyle = this.color;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);


    for (let y = 0; y < 500; y++) {
      for (let x = 0; x < 500; x++) {
        if (this.data[x][y] == this.maxIterations) {
          ctx.fillStyle = this.color;
          ctx.fillRect(x, y, 1, 1);
        } else {
          let i;
          if (this.data[x][y] > this.iterations) {
            i = this.iterations
          } else {
            i = this.data[x][y]
          }
          ctx.fillStyle = this.interpolateColor(this.color2, this.color, i / this.iterations);
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    //ctx.closePath();
  }
  showSelectedArea() {
  }

}
