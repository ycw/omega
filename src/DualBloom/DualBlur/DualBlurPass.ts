import { ShaderMaterial, Vector2, UniformsUtils, WebGLRenderer, WebGLRenderTarget, Vector4 } from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader.js';
import { DownsampleShader, UpsampleShader } from './DualBlurShader';

class DownsamplePass extends Pass {

  fsQuad: FullScreenQuad;

  constructor() {
    super();

    this.fsQuad = new FullScreenQuad(new ShaderMaterial({
      uniforms: UniformsUtils.clone(DownsampleShader.uniforms),
      vertexShader: DownsampleShader.vertexShader,
      fragmentShader: DownsampleShader.fragmentShader,
    }));
    (this.fsQuad.material as ShaderMaterial).uniforms['uHalfPixel'].value = new Vector2();
  }

  render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget | null,
    readBuffer: WebGLRenderTarget
  ) {
    (this.fsQuad.material as ShaderMaterial).uniforms['tDiffuse'].value = readBuffer.texture;
    renderer.setRenderTarget(writeBuffer);
    this.fsQuad.render(renderer);
  }
}

class UpsamplePass extends Pass {

  fsQuad: FullScreenQuad;

  constructor() {
    super();

    this.fsQuad = new FullScreenQuad(new ShaderMaterial({
      uniforms: UniformsUtils.clone(UpsampleShader.uniforms),
      vertexShader: UpsampleShader.vertexShader,
      fragmentShader: UpsampleShader.fragmentShader,
    }));
    (this.fsQuad.material as ShaderMaterial).uniforms['uOffset'].value = new Vector4();
  }

  render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget | null,
    readBuffer: WebGLRenderTarget
  ) {
    (this.fsQuad.material as ShaderMaterial).uniforms['tDiffuse'].value = readBuffer.texture;
    renderer.setRenderTarget(writeBuffer);
    this.fsQuad.render(renderer);
  }
}



export class DualBlurPass extends Pass {

  #rts: WebGLRenderTarget[];
  #passes: (DownsamplePass | UpsamplePass)[];
  #maxDuals: number;
  #duals: number;
  #effectiveDuals: number;
  #writeBuffer: null | WebGLRenderTarget;
  #readBuffer: null | WebGLRenderTarget;
  
  #copyPass: FullScreenQuad;

  constructor({
    maxDuals = 8,
    duals = 4
  } = {}) {
    super();

    if (maxDuals < 1) {
      throw new Error(`maxDuals (${maxDuals}) must >= 1`);
    }

    this.#rts = [];
    this.#passes = [];
    this.#maxDuals = maxDuals | 0;
    this.#duals = duals;
    this.#effectiveDuals = 0;
    this.#computeEffectiveDuals();

    this.#writeBuffer = null;
    this.#readBuffer = new WebGLRenderTarget(0, 0);

    for (let i = 0, I = maxDuals; i < I; ++i) { // init
      this.#passes[i] = new DownsamplePass();
      this.#passes[maxDuals + i] = new UpsamplePass();
      this.#rts[i] = new WebGLRenderTarget(0, 0);
      this.#rts[maxDuals + i] = new WebGLRenderTarget(0, 0);
    }

    // use as tee when effectiveDuals is 0
    this.#copyPass = new FullScreenQuad(new ShaderMaterial(CopyShader));
  }

  setSize(w: number, h: number) {
    for (let i = 0, I = this.#maxDuals; i < I; ++i) {
      this.#rts[i].setSize(Math.max(1, w >> (i + 1)), Math.max(1, h >> (i + 1)));
      this.#rts[2 * I - i - 1].setSize(Math.max(1, w >> i), Math.max(1, h >> i));
    }
  }

  render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    readBuffer: WebGLRenderTarget
  ) {

    if (this.#effectiveDuals === 0) {
      renderer.setRenderTarget(this.renderToScreen ? null : writeBuffer);
      (this.#copyPass.material as ShaderMaterial).uniforms['tDiffuse'].value = readBuffer.texture;
      this.#copyPass.render(renderer);
      return;
    }

    this.#readBuffer = readBuffer;

    for (let i = 0, I = this.#effectiveDuals; i < I; ++i) { // downsamples
      this.#writeBuffer = this.#rts[i];
      (this.#passes[i].fsQuad.material as ShaderMaterial).uniforms['uHalfPixel'].value.set(
        .5 / this.#readBuffer.width, .5 / this.#readBuffer.height
      );
      this.#passes[i].render(renderer, this.#writeBuffer, this.#readBuffer);
      this.#readBuffer = this.#writeBuffer; // swap
    }

    for (let I = this.#rts.length, i = I - this.#effectiveDuals; i < I; ++i) { // upsamples
      this.#writeBuffer = (i === I - 1)
        ? (this.renderToScreen ? null : writeBuffer)
        : this.#rts[i];

      if (this.#readBuffer) {
        (this.#passes[i].fsQuad.material as ShaderMaterial).uniforms['uOffset'].value.set(
          .5 / this.#readBuffer.width, .5 / this.#readBuffer.height, // half px
          1 / this.#readBuffer.width, 1 / this.#readBuffer.height // full px
        );
        this.#passes[i].render(renderer, this.#writeBuffer, this.#readBuffer);
        this.#readBuffer = this.#writeBuffer;
      }
    }
  }

  #computeEffectiveDuals() {
    this.#effectiveDuals = Math.min(Math.max(0, this.#duals | 0), this.maxDuals);
    if (this.duals !== this.#effectiveDuals) {
      console.warn(`effective duals is ${this.#effectiveDuals}`);
    }
  }

  get duals() { return this.#duals }
  set duals(value) {
    this.#duals = value;
    this.#computeEffectiveDuals();
  }

  get maxDuals() { return this.#maxDuals }
}
