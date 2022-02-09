export const RadialBlurShader = {
  defines: {
    'MAX_ITERATIONS': 100,
  },
  uniforms: {
    'tDiffuse': { value: null },
    'uRadialCenter': { value: null },
    'uIntensity': { value: 1.0 },
    'uIterations': { value: 10 }
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
    uniform vec2 uRadialCenter;
    uniform float uIntensity;
    uniform float uIterations;
    varying vec2 vUv;
    void main() {
      vec2 v = uIntensity * ( uRadialCenter * .5 + .5 - vUv );
      const float MAX_I = float( MAX_ITERATIONS );
      float I = max( 1., min( uIterations, MAX_I ) );
      for ( float i = 0. ; i < MAX_I ; i++ ) {
        if ( i >= uIterations ) break;
        gl_FragColor += texture2D( tDiffuse, vUv + v * i / I );
      }
      gl_FragColor /= I;
    }
  `
};