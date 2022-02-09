import {
  Mesh, Matrix4, Vector3, Vector2, Material,
  BufferGeometry, BufferAttribute, Uint16BufferAttribute, Uint32BufferAttribute
} from 'three';
import { CSG } from './lib/csg/index.js';

class CSGWrapper {

  #csg: CSG;

  constructor(x: Mesh | CSG) {
    this.#csg = (x instanceof CSG) ? x : meshToCsg(x);
  }

  subtract(x: Mesh | CSGWrapper) {
    return new CSGWrapper(this.#csg.subtract(
      x instanceof CSGWrapper ? x.#csg : meshToCsg(x)
    ));
  }

  intersect(x: Mesh | CSGWrapper) {
    return new CSGWrapper(this.#csg.intersect(
      x instanceof CSGWrapper ? x.#csg : meshToCsg(x)
    ));
  }

  union(x: Mesh | CSGWrapper) {
    return new CSGWrapper(this.#csg.union(
      x instanceof CSGWrapper ? x.#csg : meshToCsg(x)
    ));
  }

  toMesh() {
    return csgToMesh(this.#csg);
  }
}

function $(mesh: Mesh) {
  return new CSGWrapper(mesh);
}
export { $ as CSG };



//-
// `THREE.Mesh` to CSG
//
function meshToCsg(mesh: Mesh) {
  return CSG.fromPolygons(meshToPolygons(mesh));
}


// -
// `THREE.Mesh` to `CSG.Polygon[]`
//
function meshToPolygons(mesh: Mesh) {

  // Compute transformation matrix. The matrix is applied to geometry
  // during "populate position attribute" step. This will save one loop.
  const clone = mesh.clone();
  clone.updateMatrix();
  const { matrix } = clone;
  const shouldApplyMatrix = !matrix.equals(new Matrix4());

  // Array of `CSG.Polygon`.
  const polygons = [];

  const positions = mesh.geometry.attributes.position.array as Float32Array;
  const { normal, uv, color } = mesh.geometry.attributes;
  const normals = normal && normal.array as (undefined | Float32Array);
  const uvs = uv && uv.array;
  const colors = color && color.array as (undefined | Float32Array);
  const indices = mesh.geometry.index && mesh.geometry.index.array;
  const count = indices ? indices.length : positions.length / 3;

  // Populate polygons; create `CSG.Polygon` for each 3-vertices.
  // - `CSG.Polygon` contains `CSG.Vertex[]` and `THREE.Material`.
  // - `CSG.Vertex` must contain `.pos` (CSG.Vector) and optionally include 
  //   `normal` (CSG.Vector), `uv` (THREE.Vector2) and `color` (CSG.Vector). 

  const groups = Array.isArray(mesh.material)
    ? mesh.geometry.groups
    : [{ start: 0, count, materialIndex: 0 }];

  for (const { start, count, materialIndex } of groups) {
    const material = Array.isArray(mesh.material)
      ? mesh.material[materialIndex ?? 0]
      : mesh.material;
    for (let i = start; i < start + count; i += 3) {
      const vertices = [];
      for (let j = 0; j < 3; ++j) {
        const n = indices ? indices[i + j] : i + j;
        vertices.push(new CSG.Vertex(
          shouldApplyMatrix
            ? new Vector3().fromArray(positions, 3 * n).applyMatrix4(matrix)
            : positions.subarray(3 * n, 3 * n + 3),
          normals && normals.subarray(3 * n, 3 * n + 3),
          uvs && new Vector2().fromArray(uvs, 2 * n),
          colors && colors.subarray(3 * n, 3 * n + 3)
        ));
      }
      polygons.push(new CSG.Polygon(vertices, material));
    }
  }

  return polygons;
}



// -
// `CSG{}` to `THREE.Mesh`. The mesh will contain an indexed
// BufferGeometry which buffer attributes are sorted by `Material`.
// 
function csgToMesh(csg: CSG) {

  // Group vertices by `Material` and find vertex count in same loop. 
  const polygons = csg.toPolygons();
  const matMap = new Map(); // Map<Material{}, CSG.Vertex[][]>
  let vertexCount = 0;
  for (const { vertices, shared: material } of polygons) {
    if (matMap.has(material)) {
      matMap.get(material).push(vertices);
    }
    else {
      matMap.set(material, [vertices]);
    }
    vertexCount += vertices.length;
  }

  // Alloc TypedArrays to hold buffer attributes data.
  const positions = new Float32Array(vertexCount * 3);
  const normals = new Float32Array(vertexCount * 3);
  const uvs = new Float32Array(vertexCount * 2);
  const colors = new Float32Array(vertexCount * 3);

  // Result mesh.
  const geom = new BufferGeometry();
  const materials: Material[] = [];
  const mesh = new Mesh(geom, materials);

  // Populate geometry (`geom.attributes`, `geom.index`, `geom.groups`) and 
  // meterials (`mesh.material`) in same loop.
  let start = 0;
  let count = 0; // indices count of the current render group.
  let materialIndex = 0;

  let positionsIdx = 0;
  let normalsIdx = 0;
  let uvsIdx = 0;
  let colorsIdx = 0;

  let someHasNormal; // truthy/falsy;
  let someHasUv;     // ditto
  let someHasColor;  // ditto

  const indices = []; // holding actual data of element index buffer
  let index = 0; // index number already used

  for (const [material, vertsArray] of matMap.entries()) {
    count = 0;
    for (const verts of vertsArray) {

      // Populate indices
      for (let i = 1, I = verts.length - 1; i < I; ++i) {
        indices.push(index, index + i, index + i + 1);
      }
      index += verts.length;
      count += (verts.length - 2) * 3;

      // Populate buffer attributes
      for (const { pos, normal, uv, color } of verts) {
        // `position`
        positions[positionsIdx++] = pos.x;
        positions[positionsIdx++] = pos.y;
        positions[positionsIdx++] = pos.z;

        // `normal`
        someHasNormal || (someHasNormal = normal);
        if (normal) {
          normals[normalsIdx++] = normal.x;
          normals[normalsIdx++] = normal.y;
          normals[normalsIdx++] = normal.z;
        }
        else {
          normalsIdx += 3;
        }

        // `uv`
        someHasUv || (someHasUv = uv);
        if (uv) {
          uvs[uvsIdx++] = uv.x;
          uvs[uvsIdx++] = uv.y;
        }
        else {
          uvsIdx += 2;
        }

        // `color`
        someHasColor || (someHasColor = color);
        if (color) {
          colors[colorsIdx++] = color.x;
          colors[colorsIdx++] = color.y;
          colors[colorsIdx++] = color.z;
        }
        else {
          colorsIdx += 3;
        }
      }
    }

    materials.push(material);
    geom.addGroup(start, count, materialIndex);
    start += count;
    materialIndex += 1;
  }

  // Set element index buffer.

  if (index <= 65535) {
    geom.index = new Uint16BufferAttribute(indices, 1);
  }
  else {
    console.warn("index > 65535");
    geom.index = new Uint32BufferAttribute(indices, 1);
  }

  // Set buffer attributes.

  geom.setAttribute("position", new BufferAttribute(positions, 3));

  if (someHasNormal) {
    geom.setAttribute("normal", new BufferAttribute(normals, 3));
  }

  if (someHasUv) {
    geom.setAttribute("uv", new BufferAttribute(uvs, 2));
  }

  if (someHasColor) {
    geom.setAttribute("color", new BufferAttribute(colors, 3));
  }

  return mesh;
}