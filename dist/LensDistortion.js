import{Vector2 as e,ShaderMaterial as n,UniformsUtils as u}from"three";import{Pass as r,FullScreenQuad as t}from"three/examples/jsm/postprocessing/Pass.js";const i={uniforms:{tDiffuse:{value:null},uK0:{value:null},uCc:{value:null},uFc:{value:null},uAlpha_c:{value:0}},vertexShader:"\n    varying vec2 vUv;\n    void main() {\n      vUv = uv;\n      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n  }",fragmentShader:"\n    uniform sampler2D tDiffuse;\n    uniform vec2 uK0;\n    uniform vec2 uCc; \n    uniform vec2 uFc; \n    uniform float uAlpha_c;\n    varying vec2 vUv;\n    void main() {\n      vec2 Xn = 2. * ( vUv.st - .5 ); // -1..1\n      vec3 Xd = vec3(( 1. + uK0 * dot( Xn, Xn ) ) * Xn, 1.); // distorted \n      mat3 KK = mat3(\n        vec3(uFc.x, 0., 0.),\n        vec3(uAlpha_c * uFc.x, uFc.y, 0.),\n        vec3(uCc.x, uCc.y, 1.)\n      );\n      vec2 Xp = ( KK * Xd ).xy * .5 + .5; // projected; into 0..1 \n      if ( Xp.x >= 0. && Xp.x <= 1. && Xp.y >= 0. && Xp.y <= 1. ) {\n        gl_FragColor = texture2D( tDiffuse, Xp );\n      }\n    }\n  "};class s extends r{#e;#n;constructor({distortion:r=new e(0,0),principalPoint:s=new e(0,0),focalLength:o=new e(1,1),skew:a=0}={}){super(),this.#e=new t(new n({uniforms:u.clone(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader}));const c=this.#e.material;c.uniforms.uK0.value=r,c.uniforms.uCc.value=s,c.uniforms.uFc.value=o,c.uniforms.uAlpha_c.value=a,this.#n=c.uniforms}render(e,n,u){this.#n.tDiffuse.value=u.texture,this.renderToScreen?e.setRenderTarget(null):(e.setRenderTarget(n),this.clear&&e.clear()),this.#e.render(e)}get distortion(){return this.#n.uK0.value}set distortion(e){this.#n.uK0.value=e}get principalPoint(){return this.#n.uCc.value}set principalPoint(e){this.#n.uCc.value=e}get focalLength(){return this.#n.uFc.value}set focalLength(e){this.#n.uFc.value=e}get skew(){return this.#n.uAlpha_c.value}set skew(e){this.#n.uAlpha_c.value=e}}export{s as LensDistortionPass,i as LensDistortionShader};
