import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { RadialBlurPass } from 'omega/dist/RadialBlur.js';
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
  new THREE.BoxBufferGeometry(8, 8, 8),
  new THREE.MeshBasicMaterial({ 
    map: new THREE.TextureLoader().load('../../logo.png'),
    side: THREE.BackSide 
  })
);
scene.add(room);

//
// render
//

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new RadialBlurPass({
  intensity: .1, 
  iterations: 50,
  maxIterations: 100,
  radialCenter: new THREE.Vector2()
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
  gui.add(pass, 'intensity', 0, 1, 0.05);
  gui.add(pass, 'iterations', 1, pass.maxIterations, 0.05);
  gui.add(pass, 'maxIterations').disable();
  {
    const f = gui.addFolder('radialCenter');
    f.add(pass.radialCenter, 'x', -1, 1, 0.05);
    f.add(pass.radialCenter, 'y', -1, 1, 0.05);
  }
}