import { ShaderMaterial, WebGLRenderTarget, UniformsUtils, WebGLRenderer } from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { LumaShader, CombineShader } from './DualBloomShader';
import { DualBlurPass } from './DualBlur';

export class DualBloomPass extends Pass {

  #lumaPass: FullScreenQuad;
  #lumaRT: WebGLRenderTarget;
  #dualBlurPass: DualBlurPass;
  #dualBlurRT: WebGLRenderTarget;
  #combinePass: FullScreenQuad;
  #blurriness!: number; // will set by setter .blurriness

  // cache

  #lumaPassUniforms: ShaderMaterial['uniforms'];
  #combinePassUniforms: ShaderMaterial['uniforms'];

  constructor({
    threshold = .5,
    blurriness = .5,
    intensity = .5,
    maxDuals = 8,
  } = {}) {
    super();

    this.#lumaPass = new FullScreenQuad(new ShaderMaterial({
      uniforms: UniformsUtils.clone(LumaShader.uniforms),
      vertexShader: LumaShader.vertexShader,
      fragmentShader: LumaShader.fragmentShader,
    }));

    this.#lumaPassUniforms = (this.#lumaPass.material as ShaderMaterial).uniforms;
    this.#lumaPassUniforms['uThreshold'].value = threshold;
    this.#lumaRT = new WebGLRenderTarget(0, 0);

    this.#dualBlurPass = new DualBlurPass({ maxDuals });
    this.#dualBlurRT = new WebGLRenderTarget(0, 0);
    this.blurriness = blurriness; // which set `this.#blurriness`

    this.#combinePass = new FullScreenQuad(new ShaderMaterial({
      uniforms: UniformsUtils.clone(CombineShader.uniforms),
      vertexShader: CombineShader.vertexShader,
      fragmentShader: CombineShader.fragmentShader,
    }));
    this.#combinePassUniforms = (this.#combinePass.material as ShaderMaterial).uniforms;
    this.#combinePassUniforms['uIntensity'].value = intensity;
  }

  render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    readBuffer: WebGLRenderTarget
  ) {
    if (this.#combinePassUniforms['uIntensity'].value !== 0) {
      // ---- luma pass
      renderer.setRenderTarget(this.#lumaRT);
      this.#lumaPassUniforms['tDiffuse'].value = readBuffer.texture;
      this.#lumaPass.render(renderer);
      // ---- dual blur pass
      this.#dualBlurPass.renderToScreen = false;
      this.#dualBlurPass.render(renderer, this.#dualBlurRT, this.#lumaRT);
    }
    // ---- combine pass
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
    }
    this.#combinePassUniforms['tDiffuse'].value = readBuffer.texture;
    this.#combinePassUniforms['tBlurred'].value = this.#dualBlurRT.texture;
    this.#combinePass.render(renderer);
  }

  setSize(w: number, h: number) {
    this.#lumaRT.setSize(w, h);
    this.#dualBlurRT.setSize(w, h);
    this.#dualBlurPass.setSize(w, h);
  }

  get intensity() { return this.#combinePassUniforms['uIntensity'].value }
  set intensity(value) {
    this.#combinePassUniforms['uIntensity'].value = value;
  }

  get threshold() { return this.#lumaPassUniforms['uThreshold'].value }
  set threshold(value) {
    this.#lumaPassUniforms['uThreshold'].value = value;
  }

  get blurriness() { return this.#blurriness }
  set blurriness(value) {
    this.#blurriness = value;
    if (value > 1 || value < 0) {
      console.warn(`blurriness (${value}) will be clamped (in 0..1) internally`);
      this.#dualBlurPass.duals = Math.ceil(Math.max(0, Math.min(1, value)) * this.#dualBlurPass.maxDuals);
    } else {
      this.#dualBlurPass.duals = Math.ceil(value * this.#dualBlurPass.maxDuals);
    }
  }

  get maxDuals() { return this.#dualBlurPass.maxDuals }
};
