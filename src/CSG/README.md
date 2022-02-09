# About

CSG modeling.

Supports multi materials, vertex colors. 

Output mesh with indexed buffer geometry.



## Examples

- [csg](https://ycw.github.io/omega/ex/csg/)



## Usage

```js
import { CSG } from 'omega/dist/CSG.js'
```



## Docs

`CSG()`

```js
const csg0 = CSG(new THREE.Mesh(..)) //-> CSG{}
const csg1 = CSG(new THREE.Mesh(..)) //-> CSG{}

csg0.subtract(csg1)   //-> new CSG{}
csg0.union(csg1)      //-> new CSG{}
csg0.intersect(csg1)  //-> new CSG{}
```

Convert `CSG{}` into `Mesh`:

```js
csg.toMesh()
```



## Credits

[evanw/csg.js](https://evanw.github.io/csg.js/)