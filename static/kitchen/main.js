import * as THREE from '/kitchen/node_modules/three/build/three.module.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const user = new THREE.Group();
user.position.set(0, 0, 0);
user.add(camera);

scene.add(user);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

import { VRButton } from '/kitchen/node_modules/three/examples/jsm/webxr/VRButton.js';

document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;
user.add(renderer.xr.getController(0));

import { GLTFLoader } from '/kitchen/node_modules/three/examples/jsm/loaders/GLTFLoader.js';
const loader = new GLTFLoader();

var kitchen = null
loader.load('/kitchen/kitchen.gltf', function (gltf) {
  kitchen = gltf.scene;

  kitchen.scale.x = 5;
  kitchen.scale.y = 5;
  kitchen.scale.z = 5;

  scene.add(kitchen);
}, undefined, function (err) {
  console.error(err);
});

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.25);
scene.add(directionalLight);

user.position.z = 40;
user.position.y = 10;
user.rotation.x = -.05;

var cubes = [];
var lights = [];
for (let i = 0; i < 10; i++) {
  const color = Math.floor(Math.random()*16777216);
  const szx = 20;
  const szy = 20;
  const szz = 15;
  const x = Math.random()*szx-szx/2;
  const y = Math.random()*szy-szy/2;
  const z = Math.random()*szz-szz/2;

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({color: color});
  const cube = new THREE.Mesh(geometry, material);
  cube.visible = false;
  cube.position.set(x, y, z);
  cubes.push(cube);
  scene.add(cube);

  const light = new THREE.PointLight(color, 2, 10);
  light.position.set(x, y, z);
  lights.push(light);
  scene.add(light);
}


var done = false;
var target = 0;
var targetRotation = {
  x: camera.rotation.x,
  y: camera.rotation.y,
  z: camera.rotation.z,
}
function animate() {
  if (!!kitchen) {
    if (!done) {
      const tc = cubes[target];
      const dx = user.position.x - tc.position.x;
      const dy = user.position.y - tc.position.y;
      const dz = user.position.z - tc.position.z;

      user.position.x -= dx/(60*2);
      user.position.y -= dy/(60*2);
      user.position.z -= dz/(60*2);

      camera.lookAt(0,0,0);

      if (dx*dx+dy*dy+dz*dz < 0.05) {
        done = true;
      }
    } else {
      target = Math.floor(Math.random()*cubes.length);
      console.log(cubes[target].position);
      done = false;
      let oldRotation = {
        x: camera.rotation.x,
        y: camera.rotation.y,
        z: camera.rotation.z,
      }
      camera.lookAt(cubes[target].position);
      targetRotation.x = camera.rotation.x;
      targetRotation.y = camera.rotation.y;
      targetRotation.z = camera.rotation.z;

      camera.rotation.x = oldRotation.x;
      camera.rotation.y = oldRotation.y;
      camera.rotation.z = oldRotation.z;
    }
  }

  for (let cube of cubes) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
