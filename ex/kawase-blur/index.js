import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { KawaseBlurPass } from 'omega/dist/KawaseBlur.js';
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
composer.addPass(new KawaseBlurPass({
  renderer,
  kernels: [0, 1, 2, 2, 3]
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
  const params = { kernels: '0, 1, 2, 3, 3' };
  const ctrl = gui.add(params, 'kernels');
  gui.onFinishChange(e => handleKernelsInputChange());

  function handleKernelsInputChange() {
    if (params.kernels.trim().length === 0) {
      params.kernels = '0';
      ctrl.setValue(params.kernels);
    }

    const kernels = [];
    if (params.kernels.split(',').every(x => {
      const y = Number.parseInt(x, 10);
      return (Number.isNaN(y) || y < 0) ? alert('must be >= 0') : kernels.push(y);
    })) pass.setKernels(kernels);
  }
}