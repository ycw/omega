import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Strip, StripGeometry, StripHelper, UvPreset } from 'omega/dist/Strip.js'
import GUI from 'lil-gui'

//
// params
//

const uvFns = {
  0: UvPreset.strip[0],
  1: UvPreset.strip[1],
  2: UvPreset.strip[2],
  3: UvPreset.strip[3],
  4: UvPreset.dash[0],
  5: UvPreset.dash[1],
  6: UvPreset.dash[2],
  7: UvPreset.dash[3],
};

const params = {
  twist: -2 * Math.PI,
  taper: 0,
  nSeg: 100,
  useDash: true,
  dashArray: '10',
  dashOffset: 0,
  uvFn: 4, // idx of uvFns
};

//
// main
//

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2, .1, 100);
const controls = new OrbitControls(camera, renderer.domElement);

controls.target.set(0, 2, 0);
camera.position.set(0, 2, 3);
controls.enableDamping = true;
scene.background = new THREE.Color();

scene.add(new THREE.GridHelper());

const curve = new THREE.LineCurve3(
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 4, 0)
);

const mat = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  map: new THREE.TextureLoader().load('../../logo.png')
});

const { geom, strip } = makeStripAndStripGeom(curve, params);
const mesh = new THREE.Mesh(geom, mat);
scene.add(mesh);

const helper = new StripHelper(strip, params.nSeg, .2);
helper.material.depthTest = false;
scene.add(helper);

//
// render
//

renderer.setAnimationLoop(() => {
  renderer.render(scene, camera);
  controls.update();
});

//
// view
//

function resize(w, h, dpr = devicePixelRatio) {
  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener('resize', () => resize(innerWidth, innerHeight));
dispatchEvent(new Event('resize'));
document.body.prepend(renderer.domElement);

//
// Strip and StripGeometry
//

function makeStripAndStripGeom(curve, params) {
  const strip = new Strip(
    curve,
    (i, I) => 1 - i / I * params.taper,
    (i, I) => i / I * params.twist + Math.PI / 2
  );
  const uvFn = uvFns[params.uvFn];
  const geom = new StripGeometry(strip, (params.useDash) ? [
    params.nSeg,
    params.dashArray.split(',').map(Number.parseFloat),
    params.dashOffset
  ] : params.nSeg, uvFn);
  return { strip, geom };
}

//
// gui
//

const gui = new GUI();
{
  gui.add(params, 'twist', -2 * Math.PI, 2 * Math.PI); // via tilt fn
  gui.add(params, 'taper', 0, 1); // via radius fn
  gui.add(params, 'uvFn', {
    'UvPreset.strip[0]': 0,
    'UvPreset.strip[1]': 1,
    'UvPreset.strip[2]': 2,
    'UvPreset.strip[3]': 3,
    'UvPreset.dash[0]': 4,
    'UvPreset.dash[1]': 5,
    'UvPreset.dash[2]': 6,
    'UvPreset.dash[3]': 7,
  });
  gui.add(params, 'useDash');
  const ctrlDashArray = gui.add(params, 'dashArray').enable(params.useDash);
  const ctrlDashOffset = gui.add(params, 'dashOffset', -100, 100, 1).enable(params.useDash);
  gui.onChange(() => {
    const { geom, strip } = makeStripAndStripGeom(curve, params);
    mesh.geometry.dispose();
    mesh.geometry = geom;

    helper.strip = strip;
    helper.segments = params.nSeg;
    helper.update();

    ctrlDashArray.enable(params.useDash);
    ctrlDashOffset.enable(params.useDash);
  });
}