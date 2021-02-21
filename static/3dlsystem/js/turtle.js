function RH (a) { return [
  [1, 0, 0],
  [0, Math.cos(a), -Math.sin(a)],
  [0, Math.sin(a),  Math.cos(a)],
]};

function RL (a) { return [
  [Math.cos(a), 0, -Math.sin(a)],
  [0, 1, 0],
  [Math.sin(a), 0,  Math.cos(a)],
]};

function RU (a) { return [
  [ Math.cos(a), Math.sin(a), 0],
  [-Math.sin(a), Math.cos(a), 0],
  [0, 0, 1],
]};

export class Turtle {
  constructor (
    THREE,
    instructions,
    pitchAngle=0.977384, yawAngle=0.785398, rollAngle=0.20944,
    lengthRatio=0.8, thicknessRatio=0.8,
    hueIncrement=0.017,
  ) {
    this._3 = THREE;
    this.group = new THREE.Group();

    this.instructions = instructions;

    this.state = {
      cursor: {x: 0, y: 0, z: 0},
      rotation: {h: 1, l: 0, u: 0},
      thickness: 0.2,
      sphereThickness: 0.05,
      length: 2,
    };

    this.lengthRatio = lengthRatio;
    this.thicknessRatio = thicknessRatio;
    this.pitchAngle = pitchAngle; // branching angle
    this.yawAngle = yawAngle; // phyllotactic angle
    this.rollAngle = rollAngle;
    this.hueIncrement = hueIncrement;
    this.hue = 0;

    this.stateHistory = [];
  }

  pushState () {
    this.stateHistory.push({
      cursor: Object.assign({}, this.state.cursor),
      rotation: Object.assign({}, this.state.rotation),
      thickness: this.state.thickness,
      sphereThickness: this.state.sphereThickness,
      length: this.state.length,
      hue: this.state.hue,
    });
  }

  popState () {
    this.state = this.stateHistory.splice(-1, 1)[0];
  }

  cylinderBetween (bottom, top, thickness, length) {
    const THREE = this._3;

    const cylinder = new THREE.Mesh(
      new THREE.CylinderGeometry(thickness*this.thicknessRatio, thickness, length, 4),
      new THREE.MeshLambertMaterial({color: 0x905a22}),
    );
    cylinder.position.set(bottom.x, bottom.y, bottom.z);

    const x = top.x-bottom.x;
    const y = top.y-bottom.y;
    const z = top.z-bottom.z;
    const r = Math.sqrt(x*x+y*y+z*z);

    cylinder.rotation.y = -Math.atan2(z, x);
    cylinder.rotation.z = -Math.acos(y/r);
    // cylinder.rotation.y = 0;
    // cylinder.rotation.z = Math.PI/2;


    cylinder.position.x += x/2;
    cylinder.position.y += y/2;
    cylinder.position.z += z/2;

    this.group.add(cylinder);

    // For debugging
    // this.sphereAt(bottom, 0.1, 0xee2131);
    // this.sphereAt({x: bottom.x+x/2, y: bottom.y+y/2, z: bottom.z+z/2}, 0.1, 0xffffff);
    // this.sphereAt({x: bottom.x+x/4, y: bottom.y+y/4, z: bottom.z+z/4}, 0.1, 0xffffff);
    // this.sphereAt({x: bottom.x+x/8, y: bottom.y+y/8, z: bottom.z+z/8}, 0.1, 0xffffff);
    // this.sphereAt(top, 0.1, 0x3126ee);
  }

  sphereAt (point, radius, color=0x34e101) {
    const THREE = this._3;

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 8, 8),
      new THREE.MeshLambertMaterial({color}),
    );
    sphere.position.set(point.x, point.y, point.z);
    this.group.add(sphere);
  }

  parseOneInstruction (i) {
    const ins = this.instructions[i];
    // Note: , (comma) is reserved for the system evolver

    if (ins == 'F' || ins == 'f') {
      // Move forward in the direction the turtle is facing

      const dir = Object.assign({}, this.state.rotation);
      const norm = Math.sqrt(dir.h*dir.h + dir.l*dir.l + dir.u*dir.u);
      dir.h = this.state.length * dir.h/norm;
      dir.l = this.state.length * dir.l/norm;
      dir.u = this.state.length * dir.u/norm;

      const oldCursorPosition = Object.assign({}, this.state.cursor);

      this.state.cursor.x += dir.h;
      this.state.cursor.y += dir.l;
      this.state.cursor.z += dir.u;

      if (ins == 'F') {
        // Draw a cylinder between the old location and the new one
        this.cylinderBetween(
          oldCursorPosition,
          this.state.cursor,
          this.state.thickness,
          this.state.length
        );

        this.state.thickness *= this.thicknessRatio;
        this.state.sphereThickness /= this.thicknessRatio;
        this.state.length *= this.lengthRatio;
      }
    } else if (ins == '@') {
      // Draw a sphere
      const color = toRgb(this.hue, 1, 0.7);
      this.hue += this.hueIncrement;
      this.sphereAt(this.state.cursor, this.state.sphereThickness, color);
    } else if (ins == '+') {
      // Turn left
      this.state.rotation = rotate(RU(this.yawAngle), this.state.rotation)
    } else if (ins == '-') {
      // Turn right
      this.state.rotation = rotate(RU(-this.yawAngle), this.state.rotation)
    } else if (ins == '|') {
      // Turn 180
      this.state.rotation = rotate(RU(Math.PI), this.state.rotation)
    } else if (ins == '~') {
      // Roll left
      this.state.rotation = rotate(RH(this.rollAngle), this.state.rotation)
    } else if (ins == '/') {
      // Roll right
      this.state.rotation = rotate(RH(-this.rollAngle), this.state.rotation)
    } else if (ins == '^') {
      // Pitch up
      this.state.rotation = rotate(RL(-this.pitchAngle), this.state.rotation)
    } else if (ins == '&') {
      // Pitch down
      this.state.rotation = rotate(RL(this.pitchAngle), this.state.rotation)
    } else if (ins == '[') {
      // Push state
      this.pushState();
    } else if (ins == ']') {
      // Pop state
      this.popState();
    } else if (ins == '{') {
      // Start saving positions as vertices of a polygon
    } else if (ins == '}') {
      // Fill saved vertices
    } else if (ins == ';') {
      // Increase color map index
    } else if (ins == ':') {
      // Decrease color map index
    }
  }

  parseInstructions () {
    for (let i = 0; i < this.instructions.length; i++) {
      setTimeout(this.parseOneInstruction.bind(this, i), i*5)
    }

    // Only want this function to ever run once
    this.parseInstructions = (() => {return this.group}).bind(this);
    return this.group
  }
}

// Helpers / util

function rotate (mat, vec) {
  function dot (r, v) {
    return r[0]*v.h + r[1]*v.l + r[2]*v.u;
  }

  return {
    h: dot(mat[0], vec),
    l: dot(mat[1], vec),
    u: dot(mat[2], vec),
  }
}

function toRgb (h, s, l) {
  function hueToRgb (v1, v2, hue) {
    const dv = v2 - v1;
    hue = hue%1;
    if (hue < 0) {
      hue += 1;
    }

    if (6 * hue < 1) {
      return v1 + 6*dv*hue;
    } else if (2 * hue < 1) {
      return v2;
    } else if (1.5 * hue < 1) {
      return (v1 + dv) * (4 - 6*hue);
    } else {
      return v1;
    }
  }

  let r, g, b;
  if (s == 0) {
    r = l*255;
    g = l*255;
    b = l*255;
  } else {
    if (l < 0.5) {
      var v2 = l * (1 + s);
    } else {
      var v2 = (l + s) - (s * l);
    }

    const v1 = 2*l - v2;

    r = 255*hueToRgb(v1, v2, h + 1/3);
    g = 255*hueToRgb(v1, v2, h);
    b = 255*hueToRgb(v1, v2, h - 1/3);
  }

  return r*255*255 + g*255 + b;
}
