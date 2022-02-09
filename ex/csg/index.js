import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CSG } from 'omega/dist/CSG.js';

//
// main
//

const renderer = new THREE.WebGLRenderer();
const camera = new THREE.PerspectiveCamera(50, 2, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);
const scene = new THREE.Scene();

camera.position.set(0, 0, 5);
controls.enableDamping = true;

const sphere = CSG(new THREE.Mesh(
  new THREE.SphereGeometry(),
  new THREE.MeshNormalMaterial({ wireframe: true })
));

const box = CSG(new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 2),
  new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load('../../logo.png'),
    side: THREE.DoubleSide
  })
));

{
  const mesh = sphere.subtract(box).toMesh();
  mesh.position.x = -3;
  scene.add(mesh);
}

{
  const mesh = box.subtract(sphere).toMesh();
  mesh.position.x = -1;
  scene.add(mesh);
}

{
  const mesh = sphere.union(box).toMesh();
  mesh.position.x = 1;
  scene.add(mesh);
}

{
  const mesh = box.intersect(sphere).toMesh();
  mesh.position.x = 3;
  scene.add(mesh);
}

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
