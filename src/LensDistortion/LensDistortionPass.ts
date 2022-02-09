import { ShaderMaterial, Vector2, UniformsUtils, WebGLRenderer, WebGLRenderTarget } from 'three';
import { Pass, FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { LensDistortionShader } from './LensDistortionShader';

export class LensDistortionPass extends Pass {

  #fsQuad: FullScreenQuad;
  #uniforms: ShaderMaterial['uniforms'];

  constructor({
    distortion = new Vector2(0, 0),
    principalPoint = new Vector2(0, 0),
    focalLength = new Vector2(1, 1),
    skew = 0,
  } = {}) {
    super();

    this.#fsQuad = new FullScreenQuad(new ShaderMaterial({
      uniforms: UniformsUtils.clone(LensDistortionShader.uniforms),
      vertexShader: LensDistortionShader.vertexShader,
      fragmentShader: LensDistortionShader.fragmentShader,
    }));

    const mat = this.#fsQuad.material as ShaderMaterial;
    mat.uniforms['uK0'].value = distortion; // radial distortion coeff of term r^2
    mat.uniforms['uCc'].value = principalPoint;
    mat.uniforms['uFc'].value = focalLength;
    mat.uniforms['uAlpha_c'].value = skew;

    this.#uniforms = mat.uniforms;
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

  get distortion() { return this.#uniforms['uK0'].value }
  set distortion(value) { this.#uniforms['uK0'].value = value }

  get principalPoint() { return this.#uniforms['uCc'].value }
  set principalPoint(value) { this.#uniforms['uCc'].value = value }

  get focalLength() { return this.#uniforms['uFc'].value }
  set focalLength(value) { this.#uniforms['uFc'].value = value }

  get skew() { return this.#uniforms['uAlpha_c'].value }
  set skew(value) { this.#uniforms['uAlpha_c'].value = value }
};