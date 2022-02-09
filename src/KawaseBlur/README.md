# About

Kawase Blur effect.



## Examples

- [kawase blur](https://ycw.github.io/omega/ex/kawase-blur/)



## Usage

```js
import { KawaseBlurPass } from 'omega/dist/KawaseBlur.js'
```



## Docs

`KawaseBlurPass`

```js
const kblur = new KawaseBlurPass({ 
  renderer,               // WebGLRenderer
  kernels: [0,1,2,2,3]    // kernels
})

kblur.getKernels()        // get current kernals clone
kblur.setKernels([0])     // set new kernals
```



## Credits

[Intel / An investigation of fast real-time GPU-based image blur algorithms](https://software.intel.com/content/www/us/en/develop/blogs/an-investigation-of-fast-real-time-gpu-based-image-blur-algorithms.html)