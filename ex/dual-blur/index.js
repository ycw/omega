import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { DualBlurPass } from 'omega/dist/DualBloom.js'
import GUI from 'lil-gui';

//
// main
//

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(50, 2, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
const scene = new THREE.Scene();

camera.position.set(0, 0, 2);
controls.enableDamping = true;

scene.add(new THREE.DirectionalLight('white', .5));
scene.add(new THREE.AmbientLight('white', .5));

const map = new THREE.TextureLoader().load('../../logo.png');
map.repeat.set(16, 4);
map.wrapS = map.wrapT = THREE.RepeatWrapping;

const mesh = new THREE.Mesh(
  new THREE.TorusKnotBufferGeometry(1, .2, 128, 32),
  new THREE.MeshPhongMaterial({ map })
);
scene.add(mesh);

//
// render
//

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new DualBlurPass({
  maxDuals: 8,
  duals: 4
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
  gui.add(pass, 'duals', 0, pass.maxDuals, 1);
  gui.add(pass, 'maxDuals').disable();
}