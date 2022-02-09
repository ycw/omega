# About

Constructing shapes from font glyphs.



## Examples

- [font-outliner](https://ycw.github.io/omega/ex/font-outliner/)



## Usage

```js
import { FontOutliner } from 'omega/dist/FontOutliner.js'
```



## Docs

`FontOulinter`

Construct outliner:

```js
// from arraybuffer holding the font
const outliner = new FontOutliner(ab);
// from font url 
const outliner = await FontOutliner.fromUrl('./a.ttf');
```

Outline:

```js
const result = outliner.outline('hi');

result.shapes;  // arr of THREE.Shape
result.h;       // line height
result.w;       // advance width
result.yMin;    // bottom (usually a negative value)
result.yMax;    // top
```

Outline options:

```js
outliner.outline('hi', {
  size: 100,      // font size; default 100
  isLTR: true,   // is ltr writing-mode; default true
  isCCW: false,  // is solid shape using CCW; default false
});
```

check if glyph exists in the font; by codepoint:

```js 
outliner.hasGlyph(65);
```



## Credits

[photopea/Typr.js](https://github.com/photopea/Typr.js)