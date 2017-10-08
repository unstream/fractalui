import { TestBed, async } from '@angular/core/testing';
import { FractalComponent } from './fractal.component';
import { FormsModule } from '@angular/forms';

describe('Sierpinski', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          FractalComponent
      ],
      imports: [ FormsModule ]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(FractalComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`Interpolation of Color #000000 and #ff0000`, async(() => {
    const fixture = TestBed.createComponent(FractalComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.interpolateColor("#000000", "#ff0000")).toEqual('#7f0000');
  }));

});
