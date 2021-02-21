import * as THREE from '/3dlsystem/node_modules/three/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

import { VRButton } from '/3dlsystem/node_modules/three/examples/jsm/webxr/VRButton.js';

document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;

const user = new THREE.Group();
user.position.set(0, 13.9, 18.6);
user.rotation.x = -0.57;
user.add(camera);
scene.add(user);
user.add(renderer.xr.getController(0));

var _controllerState = {}
document.body.addEventListener('keydown', (evt) => {
  _controllerState[evt.key] = true;
});

document.body.addEventListener('keyup', (evt) => {
  delete _controllerState[evt.key];
});

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 32),
  new THREE.MeshLambertMaterial({color: 0x34e101})
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

import { compute } from '/3dlsystem/js/lsystem.js';
import { Turtle } from '/3dlsystem/js/turtle.js';

(function turtie1 () {
  const rules = {
    F: 'F[-F@][+F@][+&F@][-^F@][++^F@]',
  }
  const instructions = compute('--F', rules, 3);

  const turtie = new Turtle(
    THREE, instructions,
    Math.PI/4, Math.PI/4, Math.PI/4,
    0.8, 0.66,
  );
  scene.add(turtie.group);
  window.setTimeout(turtie.parseInstructions.bind(turtie), 0);
})();

(function turtie2 () {
  const rules = {
    F: 'F[++&F@][--^F@]/[-F@]',
  }
  const instructions = compute('--F', rules, 3);

  const turtie = new Turtle(
    THREE, instructions,
    Math.PI/4, Math.PI/4, Math.PI/4,
    0.8, 0.66,
  );
  turtie.group.position.z = 7.5;
  scene.add(turtie.group);
  window.setTimeout(turtie.parseInstructions.bind(turtie), 0);
})();

(function turtie3() {
  const rules = {
    F: 'F[&F@][--F@][^F@][+F@][+^F@]',
  }
  const instructions = compute('--F', rules, 3);

  const turtie = new Turtle(
    THREE, instructions,
    Math.PI/4, Math.PI/8, Math.PI/8,
    0.8, 0.66,
  );
  turtie.group.position.x = 7.5;
  scene.add(turtie.group);
  window.setTimeout(turtie.parseInstructions.bind(turtie), 0);
})();

// const params = {
//   alstonia: {
//     lengthRatio: 0.75,
//     branchingAngle: [48, 40, 40, 40],
//     phyllotacticAngle: [56],
//     diameterRatio: 0.95,
//     axiom: 'F',
//     rules: {
//       F: 'Y[++++++MF][-----NF][^^^^^OF][&&&&&PF]',
//       M: 'Z-M',
//       N: 'Z+N',
//       O: 'Z&O',
//       P: 'Z^P',
//       Y: 'Z-ZY+',
//       Z: 'ZZ',
//     }
//   }
// }


const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
scene.add(directionalLight);

const mvSpd = 0.1;
const rotSpd = 0.01;
function animate() {
  if (_controllerState['w']) {
    user.position.z -= mvSpd;
  } else if (_controllerState['s']) {
    user.position.z += mvSpd;
  }
  if (_controllerState['a']) {
    user.position.x -= mvSpd;
  } else if (_controllerState['d']) {
    user.position.x += mvSpd;
  }
  if (_controllerState['q']) {
    user.position.y += mvSpd;
  } else if (_controllerState['e']) {
    user.position.y -= mvSpd;
  }

  if (_controllerState['ArrowUp']) {
    user.rotation.x += rotSpd;
  } else if (_controllerState['ArrowDown']) {
    user.rotation.x -= rotSpd;
  }
  if (_controllerState['ArrowRight']) {
    user.rotation.y -= rotSpd;
  } else if (_controllerState['ArrowLeft']) {
    user.rotation.y += rotSpd;
  }

  if (_controllerState['Enter']) {
    console.log('pos:', user.position);
    console.log('rot:', user.rotation);
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
