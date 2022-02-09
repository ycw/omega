import { Vector2, Material, Mesh, BufferGeometry } from 'three';

type Vector = {
  x: number
} | ArrayLike<number>;

declare class Vertex {
  constructor(
    pos: Vector,
    normal?: Vector,
    uv?: Vector2,
    color?: Vector
  );
  pos: Vector;
  normal?: Vector;
  uv?: Vector2;
  color?: Vector;
}

declare class Polygon {
  constructor(v: Vertex[], m: Material);
  vertices: Vertex[];
  shared: Material;
}

declare class CSG {

  static Polygon: typeof Polygon;
  static Vertex: typeof Vertex;
  static fromPolygons<T>(p: Polygon[]): CSG;

  subtract(csg: CSG): CSG;
  intersect(csg: CSG): CSG;
  union(csg: CSG): CSG;
  toPolygons(): Polygon[];
}

declare class CSGWrapper {
    #private;
    constructor(x: Mesh | CSG);
    subtract(x: Mesh | CSGWrapper): CSGWrapper;
    intersect(x: Mesh | CSGWrapper): CSGWrapper;
    union(x: Mesh | CSGWrapper): CSGWrapper;
    toMesh(): Mesh<BufferGeometry, Material[]>;
}
declare function $(mesh: Mesh): CSGWrapper;

export { $ as CSG };
