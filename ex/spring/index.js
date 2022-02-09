import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Spring } from 'omega/dist/Spring.js'
import GUI from 'lil-gui'

//
// main
//

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 2, 5);
controls.enableDamping = true;

const light = new THREE.DirectionalLight();
light.position.set(2, 4, 2);
scene.add(light);

const box = new THREE.Mesh(
  new THREE.BoxBufferGeometry(),
  new THREE.MeshLambertMaterial()
);
scene.add(box);

scene.add(new THREE.GridHelper(10, 10));

// 
// spring
//

const spring = new Spring({
  from: new THREE.Vector3(-5, 0.5, 0),
  to: new THREE.Vector3(0, 0.5, 0),
  frequency: 5,
  decay: 0.5,
  maxAmplitude: 10,
  position: box.position
});

//
// render
//

const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
  controls.update();
  spring.update(clock.getDelta());
  // if (spring.isIdle) { spring.reset() } // =loop
});

//
// view
//

addEventListener('resize', () => {
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
dispatchEvent(new Event('resize'));
document.body.prepend(renderer.domElement);

//
// gui
//

const gui = new GUI();
{
  gui.add(spring.from, 'x', -5, 5, 1).name('from.x');
  gui.add(spring.to, 'x', -5, 5, 1).name('to.x');
  gui.add(spring, 'frequency', 0, 10, 0.5);
  gui.add(spring, 'decay', 0, 1, 0.05);
  gui.add(spring, 'maxAmplitude', 0, 10, 0.5);
  gui.onChange(e => spring.reset());
}