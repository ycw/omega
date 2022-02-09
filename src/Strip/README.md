# About

Generate strip geometry by a curve and a strip descriptor. 

Supports taper, twist, dasharray and uvgen.




## Examples

- [strip](../../ex/strip/)



## Usage

```js
import { Strip, StripGeometry, UvPreset, StripHelper } from 'omega/dist/Strip.js'
```



## Docs

`Strip`

```js
const strip = new Strip(
  new THREE.LineCurve3(..), // curve: curve3|curvepath
  1, // radius?: number|fn (half breadth)  
  0, // tilt?: number|fn (twist around tangent)
)
strip.curve
strip.radius
strip.tilt
strip.computeFrames(nSegs) // rhanded coords frames
```

ex.

```js 
new Strip(
  new THREE.LineCurve3(..),
  (i, I) => 1 - i / I,      // taper
  (i, I) => i / I * Math.PI // twist
)
```



---
`StripGeometry` ( extends `BufferGeometry` )

```js
new StripGeometry(
  strip,            // strip
  100,              // segments?: number|array
  undefined         // uvgen?: fn
);
```

ex.

```js
new StripGeometry(
  strip,
  [10, [1,2,3], 1], // segments=10, dashArray?=[1,2,3], dashOffset?=1
  UvPreset.dash[0]  // dash-space uvgen
);
// If dashArray has odd number of values, 
// it's repeated to yield even number of values,  
// i.e. `[1,2,3,1,2,3]`
```



---
`StripHelper` ( extends `LineSegments` )

```js
const helper = new StripHelper(
  strip,    // strip
  100       // segments: number
  1         // size?: axes size
  0xff0000  // xColor?: xAxis color
  0x00ff00  // yColor?: yAxis color
  0x0000ff  // zColor?: zAxis color
);
helper.strip
helper.segments
helper.size
helper.xColor
helper.yColor
helper.zColor
helper.update()
```

ex.

```js
const helper = new StripHelper(strip, 10);
helper.xColor.setClassName("purple");
helper.segments *= 2;
helper.update();
```



---
`UvPreset`

```js
UvPreset.dash;  // arr of dash-space uvgen.
UvPreset.strip; // arr of strip-space uvgen.
```

ex.

```js
new StripGeometry(strip, [100, [1, 2]], UvPreset.dash[0]);
new StripGeometry(strip, 100, UvPreset.strip[0]);
```