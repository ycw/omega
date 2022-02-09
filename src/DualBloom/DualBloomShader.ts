export const LumaShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'uThreshold': { value: 0. }
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uThreshold;
    varying vec2 vUv;
    void main() {
      vec4 T = texture2D( tDiffuse, vUv );
      float L = (T.r + T.r + T.g + T.g + T.g + T.b) / 6.;
      gl_FragColor = step( uThreshold, L ) * T;
    }
  `
};



export const CombineShader = {
  uniforms: {
    'tDiffuse': { value: null },
    'tBlurred': { value: null },
    'uIntensity': { value: 0. },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform sampler2D tBlurred;
    uniform float uIntensity;
    varying vec2 vUv;
    void main() {
      vec4 D = texture2D( tDiffuse, vUv );
      vec4 B = texture2D( tBlurred, vUv );
      gl_FragColor = D + uIntensity * B;
    }
  `
};