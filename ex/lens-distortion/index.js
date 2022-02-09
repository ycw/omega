
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { LensDistortionPass } from 'omega/dist/LensDistortion.js';
import GUI from 'lil-gui';

//
// main
//

const renderer = new THREE.WebGL1Renderer();
const camera = new THREE.PerspectiveCamera(50, 2, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
const scene = new THREE.Scene();

camera.position.set(0, 0, 4);
controls.enableDamping = true;

const room = new THREE.Mesh(
  new THREE.BoxBufferGeometry(8, 8, 8, 10, 10, 10),
  new THREE.MeshBasicMaterial({ wireframe: true })
);
scene.add(room);

const box = new THREE.Mesh(
  new THREE.BoxBufferGeometry(),
  new THREE.MeshBasicMaterial({ 
    map: new THREE.TextureLoader().load('../../logo.png')
  })
);
scene.add(box);

// 
// render
//

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new LensDistortionPass({
  distortion: new THREE.Vector2(1, 1),
  principalPoint: new THREE.Vector2(0, 0),
  focalLength: new THREE.Vector2(1, 1),
  skew: 0
}));

renderer.setAnimationLoop((t) => {
  controls.update();
  composer.render();
});

//
// view
//

window.addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setPixelRatio(devicePixelRatio);
  composer.setSize(innerWidth, innerHeight);
  composer.setPixelRatio(devicePixelRatio);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
dispatchEvent(new Event('resize'));
document.body.append(renderer.domElement);

//
// gui
// 

const gui = new GUI();
{
  const pass = composer.passes[1];
  {
    const f = gui.addFolder('distortion');
    f.add(pass.distortion, 'x', -1, 1, 0.1);
    f.add(pass.distortion, 'y', -1, 1, 0.1);
  }
  {
    const f = gui.addFolder('principalPoint');
    f.add(pass.principalPoint, 'x', -1, 1, 0.1);
    f.add(pass.principalPoint, 'y', -1, 1, 0.1);
  }
  {
    const f = gui.addFolder('focalLength');
    f.add(pass.focalLength, 'x', -1, 1, 0.1);
    f.add(pass.focalLength, 'y', -1, 1, 0.1);
  }
  gui.add(pass, 'skew', -Math.PI, Math.PI, 0.05);
}