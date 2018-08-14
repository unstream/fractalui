import {ColorData} from './colordata';
import {ColorUtils} from './colorutils';
import {Color} from './color';

export class Colors {
    data: ColorData[];


    constructor(public color1: string,
                public color2: string,
                public iterations: number,
                public minIterations: number,
                public useLogScale: boolean) {
        this.data = [];
        this.add(color1, 0);
        this.add(color2, iterations);
    }

    delete(iteration) {
        const index = this.data.findIndex(d => d.iteration === iteration);
        if (this.data.length > 2) {
            this.data.splice(index, 1);
        }
    }
    add(color: string, iteration: number) {
        let i = 0;
        while (i < this.data.length && iteration > this.data[i].iteration) {
            i++;
        }
        this.data.splice(i, 0, new ColorData(color, iteration));
    }

    updateMap(max) {
        const map: Color [] = new Array(max);
        for (let i = 0; i < max; i++) {
            map[i] = this.getRGBColor(i);
        }
        return map;
    }

    /**
     * Get the Color for the iteration given. The color is interpolated.
     * @param iteration
     */
    getRGBColor(iteration): Color {
        if (iteration === 0) {
            return ColorUtils.rgb(this.data[this.data.length - 1].color);
        }
        let idx = 0;
        while (idx < this.data.length && iteration > this.data[idx].iteration) {
            idx++;
        }
        if (idx === 0) {
            // before first color 0
            return ColorUtils.rgb(this.data[0].color);
        } else if ((idx === this.data.length) && (iteration > this.data[idx - 1].iteration)) {
            // after last color
            return ColorUtils.rgb(this.data[idx - 1].color);
        } else {
            const r = (iteration - this.data[idx - 1].iteration) / (this.data[idx].iteration - this.data[idx - 1].iteration);
            return ColorUtils.rgbInterpolateColor(ColorUtils.rgb(this.data[idx - 1].color), ColorUtils.rgb(this.data[idx].color), r);
        }
    }
}
