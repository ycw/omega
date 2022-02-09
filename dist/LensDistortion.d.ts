import { Vector2, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';

declare class LensDistortionPass extends Pass {
    #private;
    constructor({ distortion, principalPoint, focalLength, skew, }?: {
        distortion?: Vector2 | undefined;
        principalPoint?: Vector2 | undefined;
        focalLength?: Vector2 | undefined;
        skew?: number | undefined;
    });
    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget): void;
    get distortion(): any;
    set distortion(value: any);
    get principalPoint(): any;
    set principalPoint(value: any);
    get focalLength(): any;
    set focalLength(value: any);
    get skew(): any;
    set skew(value: any);
}

declare const LensDistortionShader: {
    uniforms: {
        tDiffuse: {
            value: null;
        };
        uK0: {
            value: null;
        };
        uCc: {
            value: null;
        };
        uFc: {
            value: null;
        };
        uAlpha_c: {
            value: number;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};

export { LensDistortionPass, LensDistortionShader };
