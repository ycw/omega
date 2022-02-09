import { Vector3, Curve as ThreeCurve, CurvePath } from "three";

export type RadiusFn = (
  i: number, I: number
) => number;

export type TiltFn = (
  i: number, I: number
) => number;

export type UvFn = (
  i: number, I: number,
  j: number, J: number,
) => ([
  number, number, // u0, v0 
  number, number // u1, v1
]);

export type Curve =
  | ThreeCurve<Vector3>
  | CurvePath<Vector3>
  ;

export type Frame = [
  Vector3, Vector3, Vector3, // B, N, T
  Vector3 // Origin
];

export type Segments =
  | [number]
  | [number, number[]]
  | [number, number[], number]
  ;

export type ParsedSegments = [
  number,
  number[],
  number
];