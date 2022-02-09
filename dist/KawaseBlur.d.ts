import { WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';

declare class KawaseBlurPass extends Pass {
    #private;
    constructor({ renderer, kernels }: {
        renderer: WebGLRenderer;
        kernels: number[];
    });
    getKernels(): number[];
    setKernels(kernels: number[]): void;
    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget): void;
    setSize(w: number, h: number): void;
}

declare const KawaseBlurShader: {
    uniforms: {
        tDiffuse: {
            value: null;
        };
        uOffset: {
            value: null;
        };
    };
    vertexShader: string;
    fragmentShader: string;
};

export { KawaseBlurPass, KawaseBlurShader };
