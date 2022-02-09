# About

Lens distortion effect.



## Examples

- [lens distortion](../../ex/lens-distortion/)



## Usage

```js
import { LensDistortionPass } from 'omega/dist/LensDistortion.js'
```



## Docs

`LensDistortionPass`

```js
const p = new LensDistortionPass({
  // +ve=barrel -ve=pincushion
  distortion: new Vector2(0, 0),
  // focus coords      
  principalPoint: new Vector2(0, 0),
  // focal length 
  focalLength: new Vector2(1, 1),
  // skew angle in rad
  skew: 0
});

p.distortion.set(0.1, 0.1)      // +ve=barrel 
p.distortion.set(-0.1, -0.1)    // -ve=pincushion
p.principalPoint.set(0.5, 0.0)  // shift focus
p.focalLength.set(0.5, 0.5)     // get closer
p.skew = Math.PI / 4            // skew 45d
```

## Credits

[Camera Calibration Toolbox for Matlab](http://www.vision.caltech.edu/bouguetj/calib_doc/htmls/parameters.html)