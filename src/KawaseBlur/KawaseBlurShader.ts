export const KawaseBlurShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'uOffset': { value: null }
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uOffset;
    varying vec2 vUv;
    void main() {
      gl_FragColor = .25 * (
        texture2D( tDiffuse, vUv + uOffset )
        + texture2D( tDiffuse, vUv - uOffset )
        + texture2D( tDiffuse, vUv + uOffset * vec2( 1., -1. ) )
        + texture2D( tDiffuse, vUv + uOffset * vec2( -1., 1. ) )
      );
    }
  `
};