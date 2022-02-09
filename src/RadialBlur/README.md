# About

Radial blur effect.



## Examples

- [radial blur](../../ex/radial-blur/)



## Usage

```js
import { RadialBlurPass } from 'omega/dist/RadialBlur.js'
```



## Docs

`RadialBlurPass`

```js
const p = new RadialBlurPass({
  // blur distance; [0, 1]
  intensity: 1.0, 
  // blur steps; [1, maxIterations]
  iterations: 10, 
  // max. blur steps (immutable)
  maxIterations: 100, 
  // center coords; (-1,-1)=BL; (1,1)=TR
  radialCenter: new THREE.Vector2()
});

p.intensity = 1
p.iterations = 10
p.maxIterations // readonly
p.radialCenter.set(0, 0)
```
