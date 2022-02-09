import { Vector2, UniformsUtils, ShaderMaterial, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { RadialBlurShader } from './RadialBlurShader';

export class RadialBlurPass extends Pass {

  #fsQuad: FullScreenQuad;
  #uniforms: ShaderMaterial['uniforms'];
  #defines: ShaderMaterial['defines'];

  constructor({
    intensity = 1.,
    iterations = 10,
    maxIterations = 100,
    radialCenter = new Vector2(),
  } = {}) {
    super();

    const material = new ShaderMaterial({
      defines: {
        ...RadialBlurShader.defines,
        MAX_ITERATIONS: maxIterations
      },
      uniforms: UniformsUtils.merge([RadialBlurShader.uniforms, {
        uRadialCenter: { value: radialCenter },
        uIntensity: { value: intensity },
        uIterations: { value: iterations }
      }]),
      vertexShader: RadialBlurShader.vertexShader,
      fragmentShader: RadialBlurShader.fragmentShader,
    });

    this.#fsQuad = new FullScreenQuad(material);
    this.#uniforms = material.uniforms;
    this.#defines = material.defines;
  }

  render(
    renderer: WebGLRenderer,
    writeBuffer: WebGLRenderTarget,
    readBuffer: WebGLRenderTarget
  ) {
    this.#uniforms['tDiffuse'].value = readBuffer.texture;
    if (this.renderToScreen) {
      renderer.setRenderTarget(null);
    } else {
      renderer.setRenderTarget(writeBuffer);
      if (this.clear) renderer.clear();
    }
    this.#fsQuad.render(renderer);
  }

  get iterations() {
    return this.#uniforms.uIterations.value;
  }

  set iterations(value) {
    if (value > this.#defines.MAX_ITERATIONS) {
      console.warn(`iterations (${value}) will be capped by maxIterations (${this.#defines.MAX_ITERATIONS}) in shader`);
    }
    this.#uniforms.uIterations.value = value;
  }

  get intensity() {
    return this.#uniforms.uIntensity.value;
  }

  set intensity(value) {
    this.#uniforms.uIntensity.value = value;
  }

  get radialCenter() {
    return this.#uniforms.uRadialCenter.value;
  }

  set radialCenter(value) {
    this.#uniforms.uRadialCenter.value = value;
  }

  get maxIterations() {
    return this.#defines.MAX_ITERATIONS;
  }

};
