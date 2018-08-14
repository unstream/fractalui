import {Color} from './color';

export class ColorUtils {
    /**
     * Pad a number to a minimun length and return it as string.
     * @param num Number to pad.
     * @param size length of the number to pad to.
     * @returns {string}
     */
    static pad(num, size): string {
        let s: string = num;
        while (s.length < size) {
            s = '0' + s;
        }
        return s;
    }

    static toRgbString(color: Color): string {
        return '#'
            + this.pad(color.r.toString(16), 2)
            + this.pad(color.g.toString(16), 2)
            + this.pad(color.b.toString(16), 2);
    }

    static rgbInterpolateColor(color1: Color, color2: Color, interpolation: number): Color {
        if (isNaN(interpolation)) {
            interpolation = 0.5;
        }
        const i = interpolation;
        const j = 1.0 - i;
        const r = Math.floor(j * color1.r + i * color2.r);
        const g = Math.floor(j * color1.g + i * color2.g);
        const b = Math.floor(j * color1.b + i * color2.b);

        return new Color(r, g, b);
    }

    static rgb(color: string): Color {
        const r = Math.floor(parseInt(color.substr(1, 2), 16));
        const g = Math.floor(parseInt(color.substr(3, 2), 16));
        const b = Math.floor(parseInt(color.substr(5, 2), 16));
        return new Color(r, g, b);
    }
}
