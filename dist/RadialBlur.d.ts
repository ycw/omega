import { Vector2, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';

declare class RadialBlurPass extends Pass {
    #private;
    constructor({ intensity, iterations, maxIterations, radialCenter, }?: {
        intensity?: number | undefined;
        iterations?: number | undefined;
        maxIterations?: number | undefined;
        radialCenter?: Vector2 | undefined;
    });
    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget): void;
    get iterations(): any;
    set iterations(value: any);
    get intensity(): any;
    set intensity(value: any);
    get radialCenter(): any;
    set radialCenter(value: any);
    get maxIterations(): any;
}

declare const RadialBlurShader: {
    defines: {
        MAX_ITERATIONS: number;
    };
    uniforms: {
        tDiffuse: {
            value: null;
        };
        uRadialCenter: {
            value: null;
        };
        uIntensity: {
            value: number;
        };
        uIterations: {
            value: number;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};

export { RadialBlurPass, RadialBlurShader };
