// (partial) modeling https://github.com/photopea/Typr.js 
// @2022 ycw 

declare module Typr {
  type Font = any[];
  type Shape = Array<{
    g: number,
    cl: number,
    ax: number, ay: number,
    dx: number, dy: number,
  }>;
  type ShapeToPathResult = {
    cmds: string[],
    crds: number[]
  };

  function parse(ab: ArrayBuffer): Font;

  module U {
    function shape(font: Font, str: string, ltr: boolean): Shape;
    function shapeToPath(font: Font, shape: Shape): ShapeToPathResult;
    function codeToGlyph(font: Font, code: number): number;
  }
}

export default Typr;
