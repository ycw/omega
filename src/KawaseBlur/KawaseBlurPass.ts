import { UniformsUtils, ShaderMaterial, WebGLRenderer, WebGLRenderTarget, Vector2 } from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { KawaseBlurShader } from './KawaseBlurShader';



class InternalKawaseBlurPass extends Pass {

  fsQuad: FullScreenQuad;
  uniforms: ShaderMaterial['uniforms'];
  shouldRenderToScreen: boolean;

  constructor(uOffset: Vector2) {
    super();

    const uniforms = UniformsUtils.clone(KawaseBlurShader.uniforms);
    uniforms.uOffset.value = uOffset;

    const material = new ShaderMaterial({
      uniforms,
      vertexShader: KawaseBlurShader.vertexShader,
      fragmentShader: KawaseBlurShader.fragmentShader,
    });

    this.fsQuad = new FullScreenQuad(material);
    this.uniforms = material.uniforms;
    this.shouldRenderToScreen = false;
  }

  render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    readBuffer: WebGLRenderTarget
  ) {
    this.uniforms['tDiffuse'].value = readBuffer.texture;

    if (this.shouldRenderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
    }
    this.fsQuad.render(renderer);
  }
}



export class KawaseBlurPass extends Pass {

  #kernels: number[];
  #renderer: WebGLRenderer;
  #internalComposer: EffectComposer;

  constructor({ renderer, kernels = [0, 1] }: { renderer: WebGLRenderer, kernels: number[] }) {
    super();
    this.#kernels = kernels;
    this.#renderer = renderer;
    this.#internalComposer = new EffectComposer(renderer, new WebGLRenderTarget(0, 0));
    this.setKernels(kernels);
  }

  getKernels() {
    return Array.from(this.#kernels);
  }

  setKernels(kernels: number[]) {
    const res = this.#renderer.getDrawingBufferSize(new Vector2());

    for (const [i, k] of kernels.entries()) {
      const uOffset = new Vector2().setScalar(.5 + k).divide(res);
      const pass = this.#internalComposer.passes[i] as InternalKawaseBlurPass;
      if (pass) { // reuse
        pass.uniforms.uOffset.value = uOffset;
        pass.shouldRenderToScreen = false;
      } else {
        this.#internalComposer.addPass(new InternalKawaseBlurPass(uOffset));
      }
    }

    this.#internalComposer.passes.length = kernels.length; // rm unused
    this.#internalComposer.reset();
    this.#kernels = Array.from(kernels);
  }

  render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    readBuffer: WebGLRenderTarget
  ) {
    if (this.#kernels.length === 0) return;
    // ---- transfer ownership
    this.#internalComposer.readBuffer = readBuffer;
    this.#internalComposer.writeBuffer = writeBuffer;
    (this.#internalComposer.passes[this.#internalComposer.passes.length - 1] as InternalKawaseBlurPass).shouldRenderToScreen = this.renderToScreen;
    this.#internalComposer.render();
  }

  setSize(w: number, h: number) {
    this.#internalComposer.setSize(w, h);
    this.setKernels(this.#kernels);
  }

};
