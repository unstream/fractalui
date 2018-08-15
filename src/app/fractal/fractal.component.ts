import {AfterViewInit, Component, OnInit, ViewChild, HostListener} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HttpParams} from '@angular/common/http';
import {NgForm} from '@angular/forms';
import {Fractal} from './fractal';
import {Colors} from '../colors/colors';
import { environment } from '../../environments/environment';
import {Color} from '../colors/color';
import {animationFrame} from 'rxjs/scheduler/animationFrame';


@Component({
    selector: `app-fractal`,
    templateUrl: './fractal.component.html',
    styleUrls: ['./fractal.component.css']
})

export class FractalComponent implements AfterViewInit, OnInit {
    static readonly SQRT075 = Math.sqrt(0.75);

    maxIterations = 100;
    colorModel = new Colors('#ff6b09', '#ffad20', 100, 1, false);
    model = new Fractal(-1.5, -1, 0.5, 1, 100, 0.1);
    last;
    context: CanvasRenderingContext2D;
    lastMouseDownEvent: MouseEvent;
    @ViewChild('myCanvas') myCanvas;

    data: number[][];

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
    }


    ngAfterViewInit() {
        const canvas = this.myCanvas.nativeElement;
        this.context = canvas.getContext('2d');
    }

    onSubmit(f: NgForm) {
        this.model = f.form.value;
        this.ngOnInit();
    }

    colorChange(colors: Colors) {
        this.colorModel = colors;
        this.render();
    }

    mouseDown(event: MouseEvent) {
        this.lastMouseDownEvent = event;
    }

    mouseUp(event: MouseEvent) {
    }

    dragged(event: MouseEvent) {
        console.log('dragged');
        this.last = {...this.model};
        const wx = this.model.c1 - this.model.c0;
        const wy = this.model.c1i - this.model.c0i;

        const dx = wx * (event.offsetX - this.lastMouseDownEvent.offsetX) / 500.0;
        const dy = wy * (event.offsetY - this.lastMouseDownEvent.offsetY) / 500.0;

        this.model.c0 -= dx;
        this.model.c0i -= dy;
        this.model.c1 -= dx;
        this.model.c1i -= dy;
        this.showSelectedArea();
        this.ngOnInit();
    }

    clicked(event) {
        console.log('clicked');
        this.last = {...this.model};
        const wx = this.model.c1 - this.model.c0;
        const wy = this.model.c1i - this.model.c0i;
        const cx = this.model.c0 + wx * (event.offsetX / 500.0);
        const cy = this.model.c0i + wx * (event.offsetY / 500.0);
        this.model.c0 = cx - wx / 4;
        this.model.c0i = cy - wy / 4;
        this.model.c1 = cx + wx / 4;
        this.model.c1i = cy + wy / 4;
        this.showSelectedArea();
        this.ngOnInit();
    }

    save() {
        alert('save');
    }

    gotoLast() {
        this.model = this.last;
        this.ngOnInit();
    }

    ngOnInit(): void {
        const params = new HttpParams()
            .set('c0', '' + this.model.c0)
            .set('c0i', '' + this.model.c0i)
            .set('c1', '' + this.model.c1)
            .set('c1i', '' + this.model.c1i)
            .set('minIterations', '' + this.model.minIterations)
            .set('threshold', '' + this.model.threshold);
        //  .set('iterations', '' + this.model.maxIterations);
            this.http.get<LongQuad>(environment.fractalServiceUrl, {params}).subscribe(data => {
            this.data = data.data;
            let max = 0;
            let min = this.data[0][0];
            for (let x = 0; x < 500; x++) {
                for (let y = 0; y < 500; y++) {
                    if (this.data[x][y] > max) {
                        max = this.data[x][y];
                    }
                    if (this.data[x][y] < min) {
                        min = this.data[x][y];
                    }
                }
            }
            this.colorModel.iterations = max;
            this.colorModel.minIterations = min;
            this.maxIterations = max;
            console.log('draw');
            this.render();
        });
    }

    render() {
        const renderStartTime = performance.now();

        const ctx = this.context;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        const newImageData = ctx.createImageData(ctx.canvas.width, ctx.canvas.height);
        let factor;
        let max;
        let min;
        if (this.colorModel.useLogScale) {
            max = Math.log(this.colorModel.iterations);
            min = Math.log(this.colorModel.minIterations);
        } else {
            max = this.colorModel.iterations;
        }
        const map = this.colorModel.updateMap(max);
        for (let y = 0; y < ctx.canvas.height; y++) {

            for (let x = 0; x < ctx.canvas.width; x++) {
                if (this.data[x][y] === this.maxIterations) {
                    this.addPixel(newImageData, x, y, 255, 255, 0);

                    // ctx.fillStyle = this.colorModel.data[0].color;
                    // ctx.fillRect(x, y, 1, 1);
                } else {
                    let i;
                    if (this.data[x][y] >= this.colorModel.iterations) {
                        i = this.colorModel.iterations;
                    } else {
                        i = this.data[x][y];
                    }
                    if (this.colorModel.useLogScale) {
                        factor = (Math.log(i) - min) / max;
                    } else {
                        factor = i / max;
                    }
                    this.addPixel(newImageData, x, y, map[i].r, map[i].g, map[i].b);
                    // ctx.fillStyle = this.colorModel.getColor(i);
                    // ctx.fillRect(x, y, 1, 1);
                }
            }
        }
        ctx.putImageData(newImageData, 0, 0);
        console.log('Rendertime: ' + (performance.now() - renderStartTime));
    }




    addPixel(imageData, x, y, r, g, b) {
        const d = imageData.data;
        const i = (x << 2) + (y * imageData.width << 2);
        d[i] += r;
        d[i + 1] += g;
        d[i + 2] += b;
        d[i + 3] += 255;
    }

    showSelectedArea() {
    }

}
