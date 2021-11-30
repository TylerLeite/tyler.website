import * as THREE from '/3dlsystem/node_modules/three/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 50);

const renderer = new THREE.WebGLRenderer();
renderer.physicallyCorrectLights = true;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x3f4fe8, 1);
document.body.appendChild(renderer.domElement);

import { VRButton } from '/3dlsystem/node_modules/three/examples/jsm/webxr/VRButton.js';

document.body.appendChild(VRButton.createButton(renderer));
renderer.xr.enabled = true;

const user = new THREE.Group();
user.position.set(0, 3, 0);
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
  new THREE.PlaneGeometry(100, 100, 3200),
  new THREE.MeshLambertMaterial({color: 0x34e101})
);
plane.rotation.x = -Math.PI / 2;
scene.add(plane);

import { compute } from '/3dlsystem/js/lsystem.js';
import { Turtle, toRgb } from '/3dlsystem/js/turtle.js';

const systems = [{
  axiom: 'F',
  rules: {
    F: 'F[>F<[^F@][vF@]][<F[>--v<F[vF@][^F@]]]',
  },
  iterations: 2,
}, {
  axiom: 'F',
  rules: {
    F: 'F+[<X][<<<vYF@]--[>^^Y][>>>F@X]',
    X: 'F^F[+Y][F@-^^X]',
    Y: 'F[X]++Y[<X][<vF@]',
  },
  iterations: 2,
}, {
  axiom: 'F',
  rules: {
    F: 'F[X][<Z]Y',
    X: 'F^F[+Y][[+>+F@]-^X]',
    Y: 'F[Z]++Y[<X][<vF@]',
    Z: 'F[+>X][-<Y]F@'
  },
  iterations: 3,
}, {
  axiom: 'F',
  rules: {
    F: 'F[++^X]--vF',
    X: 'F+X@',
  },
  iterations: 2,
  sphereThicknessRatio: 0.8,
}, {
  axiom: 'F[<F][<^^F][>F][>^^F]',
  rules: {
    F: 'F[+X][-Y]',
    X: 'F[<<Y]>F@',
    Y: 'F-FX@',
  },
  iterations: 2,
}];

const num_trees = 50;
var trees = [];

for (let i = 0; i < num_trees; i++) {
  const si = Math.floor(Math.random()*systems.length);
  const system = systems[si];

  const instructions = compute(system.axiom, system.rules, system.iterations);

  let sphereThicknessRatio = 1.1;
  if (!!system.sphereThicknessRatio) {
    sphereThicknessRatio = system.sphereThicknessRatio;
  }
  const turtie = new Turtle(THREE, instructions, sphereThicknessRatio);
  turtie.hue = Math.random();
  turtie.trunkColor = 0x5a22 + 255*255*255*(Math.random());
  scene.add(turtie.group);
  if (num_trees == 1) {
    turtie.group.position.z = -20;
  } else {
    turtie.group.position.x = Math.random()*100-50;
    turtie.group.position.z = Math.random()*100-50;
  }

  trees.push(turtie);
}


const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

const mvSpd = 0.1;
const rotSpd = 0.015;
function animate() {
  if (_controllerState['w']) {
    user.position.x -= mvSpd*Math.sin(user.rotation.y);
    user.position.z -= mvSpd*Math.cos(user.rotation.y);
  } else if (_controllerState['s']) {
    user.position.x += mvSpd*Math.sin(user.rotation.y);
    user.position.z += mvSpd*Math.cos(user.rotation.y);
  }
  if (_controllerState['a']) {
    user.rotation.y += rotSpd;
  } else if (_controllerState['d']) {
    user.rotation.y -= rotSpd;
  }

  if (_controllerState['ArrowRight']) {
    user.rotation.y -= rotSpd;
  } else if (_controllerState['ArrowLeft']) {
    user.rotation.y += rotSpd;
  }

  const x = user.position.x;
  const z = user.position.z;

  camera.updateMatrix();
  camera.updateMatrixWorld();
  const frustum = new THREE.Frustum();
  frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
  ));

  for (let i = 0; i < trees.length; i++) {
    const tx = trees[i].group.position.x;
    const tz = trees[i].group.position.z;

    const r2 = (tx-x)*(tx-x) + (tz-z)*(tz-z);

    if (frustum.containsPoint(new THREE.Vector3(tx, 0, tz))) {
      if (r2 < 625 && !trees[i].parsed) {
        window.setTimeout(trees[i].parseInstructions.bind(trees[i]), 0);
      }

      if (r2 < 100) {
        // TODO: figure out how to do lights more efficiently so this doesnt lag
        // trees[i].lights.visible = true;
        for (let j = 0; j < trees[i].lights.children.length; j++) {
          trees[i].lights.children[j].intensity = (100-r2)/100;
        }
      }
    }

    if (r2 > 105) {
      trees[i].lights.visible = false;
    }
  }

  if (_controllerState['Enter']) {
    console.log('pos:', user.position);
    console.log('rot:', user.rotation);
    console.log('x,z,t', x, z, r);
    console.log('skyhue', skyHue);
    console.log('bgcolor', bgColor,  bgColor.toString(16));
  }

  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
