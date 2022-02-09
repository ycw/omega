import { Color, LineSegments, BufferGeometry, LineBasicMaterial, ColorRepresentation, BufferAttribute } from "three";
import { Strip } from "./Strip";

export class StripHelper extends LineSegments {

  xColor: Color;
  yColor: Color;
  zColor: Color;

  constructor(
    public strip: Strip,
    public segments: number,
    public size = 1,
    xColor: ColorRepresentation = 0xff0000,
    yColor: ColorRepresentation = 0x00ff00,
    zColor: ColorRepresentation = 0x0000ff
  ) {
    super(
      new BufferGeometry(),
      new LineBasicMaterial({ vertexColors: true })
    );
    this.type = "StripHelper";
    this.xColor = new Color(xColor);
    this.yColor = new Color(yColor);
    this.zColor = new Color(zColor);
    this.update();
  }

  update() {
    const segments = Math.max(1, this.segments | 0);
    const size = Math.max(0, this.size);
    const frames = this.strip.computeFrames(segments);
    const ps = new Float32Array(18 * frames.length);
    const cs = new Float32Array(18 * frames.length);
    this.geometry.dispose();
    this.geometry.attributes.position = new BufferAttribute(ps, 3);
    this.geometry.attributes.color = new BufferAttribute(cs, 3);

    for (const [i, [B, N, T, O]] of frames.entries()) {
      // pos
      B.multiplyScalar(size).add(O);
      N.multiplyScalar(size).add(O);
      T.multiplyScalar(size).add(O);
      ps.set([
        O.x, O.y, O.z, B.x, B.y, B.z,
        O.x, O.y, O.z, N.x, N.y, N.z,
        O.x, O.y, O.z, T.x, T.y, T.z,
      ], 18 * i);

      // color
      cs.set([
        this.xColor.r, this.xColor.g, this.xColor.b,
        this.xColor.r, this.xColor.g, this.xColor.b,
        this.yColor.r, this.yColor.g, this.yColor.b,
        this.yColor.r, this.yColor.g, this.yColor.b,
        this.zColor.r, this.zColor.g, this.zColor.b,
        this.zColor.r, this.zColor.g, this.zColor.b,
      ], 18 * i);
    }
  }
}