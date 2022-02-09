import { WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass } from 'three/examples/jsm/postprocessing/Pass.js';

declare class DualBloomPass extends Pass {
    #private;
    constructor({ threshold, blurriness, intensity, maxDuals, }?: {
        threshold?: number | undefined;
        blurriness?: number | undefined;
        intensity?: number | undefined;
        maxDuals?: number | undefined;
    });
    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget): void;
    setSize(w: number, h: number): void;
    get intensity(): any;
    set intensity(value: any);
    get threshold(): any;
    set threshold(value: any);
    get blurriness(): number;
    set blurriness(value: number);
    get maxDuals(): number;
}

declare class DualBlurPass extends Pass {
    #private;
    constructor({ maxDuals, duals }?: {
        maxDuals?: number | undefined;
        duals?: number | undefined;
    });
    setSize(w: number, h: number): void;
    render(renderer: WebGLRenderer, writeBuffer: WebGLRenderTarget, readBuffer: WebGLRenderTarget): void;
    get duals(): number;
    set duals(value: number);
    get maxDuals(): number;
}

export { DualBloomPass, DualBlurPass };
