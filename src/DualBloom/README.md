# About 

Bloom effect by 'dual blurring'. 

Supports transparency. 

Exposed the internal blur pass for using standalone.



## Examples

- [dual-bloom](https://ycw.github.io/omega/ex/dual-bloom/)
- [dual-blur](https://ycw.github.io/omega/ex/dual-blur/)



## Usage 

```js
import { DualBloomPass, DualBlurPass } from 'omega/dist/DualBloom.js'
```



## Docs

`DualBloomPass`

```js
const bloom = new DualBloomPass({
  maxDuals: 8,      // see DualBlurPass.maxDuals
  blurriness: 0.5,  // [0..1]; maxDuals related.
  threshold: 0.5,   // apply bloom if luma > threshold
  intensity: 0.5,   // bloom intensity
})
bloom.maxDuals       // readonly
bloom.blurriness
bloom.threshold
bloom.intensity
```


---
`DualBlurPass`

```js
const blur = new DualBlurPass({
  maxDuals: 8,  // max. duals (downsampling+upsampling)
  duals: 4      // desired duals count; [0..maxDuals]
})
blur.maxDuals   // readonly
blur.duals
```



## Credits

[Marius Bjørge / Bandwidth-efficient graphics - siggraph2015](https://community.arm.com/cfs-file/__key/communityserver-blogs-components-weblogfiles%2F00-00-00-20-66%2Fsiggraph2015_2D00_mmg_2D00_marius_2D00_notes.pdf)