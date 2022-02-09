import { ShapePath, Shape } from 'three';
import Typr from "./lib/Typr/index.js";

export class FontOutliner {

  #font: any;

  static async fromUrl(fontUrl: string) {
    return new FontOutliner(await (await fetch(fontUrl)).arrayBuffer());
  }

  constructor(arrayBuffer: ArrayBuffer) {
    this.#font = Typr.parse(arrayBuffer)[0];
  }

  outline(
    text: string, 
    options: {size?: number, isLTR?: boolean, isCCW?: boolean } = {}
  ) {
    const size = options.size ?? 100;
    const isLTR = options.isLTR ?? true;
    const isCCW = options.isCCW ?? false;
    const font = this.#font;
    const shape = Typr.U.shape(font, text, isLTR);

    const { cmds, crds } = Typr.U.shapeToPath(font, shape);
    const shapePath = new ShapePath();
    const s = size / font.head.unitsPerEm;
    let i = 0;
    for (const cmd of cmds) {
      switch (cmd) {
        case "M":
          shapePath.moveTo(crds[i++] * s, crds[i++] * s);
          break;
        case "L":
          shapePath.lineTo(crds[i++] * s, crds[i++] * s);
          break;
        case "Q":
          shapePath.quadraticCurveTo(crds[i++] * s, crds[i++] * s, crds[i++] * s, crds[i++] * s);
          break;
        case "C":
          shapePath.bezierCurveTo(crds[i++] * s, crds[i++] * s, crds[i++] * s, crds[i++] * s, crds[i++] * s, crds[i++] * s);
          break;
      }
    }

    // Convert shapePath to shapes
    const shapes = shapePath.toShapes(isCCW) as Shape[];

    // Compute line height
    const h = (font.head.yMax - font.head.yMin) * s;

    // Compute total advance width 
    const w = shape.reduce((o, nu) => o + nu.ax, 0) * s;

    // Compute yMin and yMax
    const yMax = font.head.yMax * s;
    const yMin = font.head.yMin * s;

    return { shapes, h, w, yMin, yMax };
  }

  hasGlyph(codePoint: number) {
    return Typr.U.codeToGlyph(this.#font, codePoint) > 0;
  }

}