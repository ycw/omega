import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontOutliner } from 'omega/dist/FontOutliner.js'

//
// main
//

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(50, 2, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
const scene = new THREE.Scene();

camera.position.set(0, 0, 3);
controls.enableDamping = true;

scene.add(new THREE.HemisphereLight('white', 'gray'));
scene.add(new THREE.DirectionalLight());

const outliner = await FontOutliner.fromUrl('./font/aqua.ttf');
const { shapes } = outliner.outline('OMEGA', { size: 1 });

const geom = new THREE.ExtrudeBufferGeometry(shapes, {
  depth: 0.2, 
  curveSegments: 8,
  bevelSegments: 8, 
  bevelThickness: 0.02, 
  bevelSize: 0.03, 
  bevelOffset: 0
}).center();
const mat = new THREE.MeshPhongMaterial();
scene.add(new THREE.Mesh(geom, mat));

//
// render
//

renderer.setAnimationLoop((t) => {
  controls.update();
  renderer.render(scene, camera);
});

//
// view
//

window.addEventListener('resize', () => {
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.setPixelRatio(devicePixelRatio);
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
});
dispatchEvent(new Event('resize'));
document.body.append(renderer.domElement);
