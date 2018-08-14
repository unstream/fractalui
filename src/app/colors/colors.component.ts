import {Component, ViewChild, OnInit, AfterViewInit, EventEmitter, Output, Input} from '@angular/core';
import {Colors} from './colors';
import {ColorUtils} from './colorutils';
import {ColorData} from './colordata';


@Component({
    selector: 'app-colors',
    templateUrl: './colors.component.html',
    styleUrls: ['./colors.component.css']
})
export class ColorsComponent implements OnInit, AfterViewInit {

    context: CanvasRenderingContext2D;
    @ViewChild('colorCanvas') theCanvas;

    @Input()
    model: Colors;

    @Output()
    colorChange = new EventEmitter<Colors>();

    constructor() {
    }

    ngAfterViewInit() {
        const canvas = this.theCanvas.nativeElement;

        // Make it visually fill the positioned parent
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        // ...then set the internal size to match
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        this.context = canvas.getContext('2d');
        this.draw();
    }

    ngOnInit() {

    }

    deleteRow(iteration) {
       this.model.delete(iteration);
       this.onChanged();
    }

    private draw() {
        const ctx = this.context;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for (let x = 0; x < ctx.canvas.width; x++) {
            ctx.fillStyle = this.getCanvasColor(x * this.model.iterations / ctx.canvas.width);
            ctx.fillRect(x, 0, 1, 50);
        }
    }


    private getCanvasColor(x): string {
        return ColorUtils.toRgbString(this.model.getRGBColor(x));
    }

    onChanged() {
        this.draw();
        this.colorChange.emit(this.model);
    }

    clicked(e) {
        const x = e.layerX;
        const color = this.getCanvasColor(x * this.model.iterations / this.context.canvas.width);
        this.model.add(color, x * this.model.iterations / this.context.canvas.width);
        this.onChanged();
    }
}
