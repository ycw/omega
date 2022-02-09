import { Curve as Curve$1, Vector3, CurvePath, BufferGeometry, LineSegments, Color, ColorRepresentation } from 'three';

declare type RadiusFn = (i: number, I: number) => number;
declare type TiltFn = (i: number, I: number) => number;
declare type UvFn = (i: number, I: number, j: number, J: number) => ([
    number,
    number,
    number,
    number
]);
declare type Curve = Curve$1<Vector3> | CurvePath<Vector3>;
declare type Frame = [
    Vector3,
    Vector3,
    Vector3,
    Vector3
];
declare type Segments = [number] | [number, number[]] | [number, number[], number];
declare type ParsedSegments = [
    number,
    number[],
    number
];

declare class Strip {
    curve: Curve;
    radius: number | RadiusFn;
    tilt: number | TiltFn;
    constructor(curve: Curve, radius?: number | RadiusFn, tilt?: number | TiltFn);
    computeFrames(segments: number): Frame[];
}

declare class StripGeometry extends BufferGeometry {
    #private;
    constructor(strip: Strip, segments: number | Segments, uvFn?: UvFn);
    static parseSegments(segments: number | Segments): ParsedSegments;
}

declare class StripHelper extends LineSegments {
    strip: Strip;
    segments: number;
    size: number;
    xColor: Color;
    yColor: Color;
    zColor: Color;
    constructor(strip: Strip, segments: number, size?: number, xColor?: ColorRepresentation, yColor?: ColorRepresentation, zColor?: ColorRepresentation);
    update(): void;
}

declare class UvPreset {
    static dash: [UvFn, UvFn, UvFn, UvFn];
    static strip: [UvFn, UvFn, UvFn, UvFn];
}

export { Strip, StripGeometry, StripHelper, UvPreset };
