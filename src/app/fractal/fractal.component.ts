import {AfterViewInit, Component, OnInit, ViewChild} from "@angular/core";
import {HttpClient} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {Fractal} from './fractal';

//import {HostListener} from "@angular/core";

@Component({
  selector: `fractal-app`,
  templateUrl: './fractal.component.html',
  styleUrls: ['./fractal.component.css']
})

export class FractalComponent implements AfterViewInit, OnInit {
    static readonly SQRT075 = Math.sqrt(0.75);

  iterations = 8;
  maxIterations = 100;


  color = "#ff6b09";
  color2 = "#ffad20";

  model = new Fractal(-1.5, -1, 0.5, 1, 100);

  context: CanvasRenderingContext2D;

  @ViewChild("myCanvas") myCanvas;


  data: number[][];
  constructor(private http: HttpClient) {}


  ngAfterViewInit() {
    const canvas = this.myCanvas.nativeElement;
    this.context = canvas.getContext("2d");
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
        .set("c1i", '' + this.model.c1i);
      //  .set("iterations", '' + this.model.maxIterations);
      this.http.get<LongQuad>('http://192.168.99.100:80/fractalservice/api/fractal/longquad', {params}).subscribe(data => {
      this.data = data.data;
      console.log("draw");
      this.draw();
    });
  }

  onSubmit(f: NgForm) {
    console.log(f.form.value);
    this.model = f.form.value;
    console.log("c0",this.model.c0);
    this.ngOnInit();
  }

  draw() {
    let ctx = this.context;
    ctx.fillStyle = this.color;
    ctx.clearRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    for(let x = 0; x < 500; x++) {
      for(let y = 0; y< 500; y ++) {
        if (this.data[x][y] > this.maxIterations) {
          this.maxIterations = this.data[x][y];
        }
        if (this.data[x][y] == this.maxIterations) {
          ctx.fillStyle = "#00ff00";
          ctx.fillRect( x, y, 1, 1 );
        } else {
          ctx.fillStyle = this.interpolateColor(this.color2, this.color, (1.0 * this.data[x][y])/this.maxIterations);
          ctx.fillRect( x, y, 1, 1 );
        }
      }
    }

    let l = Math.min(ctx.canvas.clientWidth, ctx.canvas.clientWidth);
    ctx.closePath();
  }
}
