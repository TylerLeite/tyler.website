const truba = true;
const fluba = false;

const hg = 1*window.innerHeight;
const wd = 1*window.innerWidth;

const canvas = document.getElementById('canvas');

canvas.width = wd*2;
canvas.height = hg*2;
canvas.style.width = wd;
canvas.style.height = hg;

const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#34de1f';
ctx.strokeWidth = '1px';

document.body.appendChild(canvas);

function compute (start, rules, iterations, chance, options=null) {
  let cur = start;
  for (let i = 0; i < iterations; i++) {
    for (let k in rules) {
      cur = cur.split(k).join('@'+k);
    }

    for (let k in rules) {
      let nk = k;
      if (options && options.includes(k)) {
        if (Math.random() < chance) {
          let newOptions = options.slice();
          newOptions.splice(newOptions.indexOf(k), 1);
          nk = newOptions[Math.floor(Math.random()*newOptions.length)];
        }
      }
      cur = cur.split('@'+k).join(rules[nk]);
    }
  }

  return cur;
}

// Parsley relied on a bug in compute ¯\_(ツ)_/¯
function parsleyCompute (start, rules, iterations, chance, options=null) {
  let cur = start;
  for (let i = 0; i < iterations; i++) {
    for (let k in rules) {
      cur = cur.split(k).join('@'+k);
    }

    for (let k in rules) {
      if (options && options.includes(k)) {
        if (Math.random() < chance) {
          let newOptions = options.slice();
          newOptions.splice(newOptions.indexOf(k), 1);
          k = newOptions[Math.floor(Math.random()*newOptions.length)];
        }
      }
      cur = cur.split('@'+k).join(rules[k]);
    }
  }

  return cur;
}

function stochasticCompute (start, rules, iterations, chance, options) {
  return compute(start, rules, iterations, chance, options);
}

function calculateNewPosition (sx, sy, r, t) {
  // get degrees in radians
  t = t * Math.PI / 180;

  // get deltas
  dx = r * Math.cos(t);
  dy = r * Math.sin(t)

  return [sx+dx, sy+dy];
}

let [x, y] = [2.1445421, 1];
// let angle = 180 * Math.atan(y/x) / Math.PI;
let angle = 180 * Math.atan2(y, x) / Math.PI;

let stack = [];

let color = 0.315;
let colorStep = 0;
let saturation = 0.7549;
let lightness = 0.4961;
let preserveColor = fluba;

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

  return `rgb(${r}, ${g}, ${b})`;
}

function renderStep (sym, dtheta, len) {
  if (sym.toUpperCase() == 'F' || sym.toUpperCase() == 'B') {
    // draw forward
    const mul = 1 - 2*(sym.toUpperCase() == 'B');
    [x, y] = calculateNewPosition(x, y, mul*len, angle);

    ctx.lineTo(x, hg*2-y);

    ctx.strokeStyle = toRgb(color, 1, 0.7);
    ctx.moveTo(x, hg*2-y);
  } else if (sym == '+') {
    // turn clockwise 25 degrees
    angle += dtheta;
  } else if (sym == '-') {
    // turn counterclockwise 25 degrees
    angle -= dtheta;
  } else if (sym == '[') {
    // save position and angle
    stack.push([x, y, angle, color]);
  } else if (sym == ']') {
    // restore position and angle
    let oldColor;
    [x, y, angle, oldColor] = stack.pop();
    ctx.moveTo(x, hg*2-y);

    if (preserveColor) {
      color = oldColor;
    }
  } else if (sym == 'c') {
    color += colorStep;
  } else {
    // ignore variables
    return;
  }
}

function renderSteps (syms, dtheta, len, stepped, renderId) {
  ctx.beginPath();
  for (let i = 0; i < syms.length; i++) {
    if (renderId != currentRenderId) {
      break;
    }
    renderStep(syms[i], dtheta, len, stepped);
  }
  ctx.closePath();
  ctx.stroke();
}

// This was designed pretty badly and I don't feel like refactoring it so here
//   is a tried-and-true hacky workaround
function updateVars (_x, _y, _colorStep, _preserveColor, _angle) {
  x = _x;
  y = _y;
  colorStep = _colorStep;
  preserveColor = _preserveColor;
  angle = _angle;
}

var currentRenderId = 'abc123';

function cancel () {
  currentRenderId = Math.random().toString(26);
  ctx.clearRect(0, 0, wd*2, hg*2);
}

function render (str, dtheta=25, len=10, stepped=fluba, renderId='abc123') {
  ctx.beginPath();
  ctx.moveTo(x, hg*2-y);
  ctx.closePath();
  ctx.stroke();

  if (!stepped) {
    stepped = str.length;
  }

  for (let i = 0; i < str.length; i += stepped) {
    if (renderId != currentRenderId) {
      return;
    }

    if (i + stepped > str.length) {
      stepped = str.length - i;
    }

    setTimeout(
      renderSteps.bind(null, str.slice(i, i + stepped), dtheta, len, stepped, renderId),
      Math.floor(i/stepped)
    );
  }
}

//////////////////
// The Fun Part //
//////////////////

const barnsley = {
  'X': 'F+[[X]-X]-F[-FX]+X',
  'F': 'FF',
};
// x = wd/2;
// y = hg/2;
// render(compute('X', barnsley, 6), 25, 10, fluba);

const seaweed = {
  'X': 'cF+X[cF+X[cF+X]X-X][cF-X[cF-X]]-X',
  'F': 'FF',
};
// x = wd/2;
// y = hg/6;
// preserveColor = truba;
// colorStep = 0.07;
// render(compute('X', seaweed, 5), 13, 8, 100);

const corndog = {
  'X': 'F+X-[X-X]+',
  'F': 'FF',
};
// x = wd/2;
// y = hg/2;
// render(compute('[X]++++++++++++[X]++++++++++++[X]', corndog, 6), 10, 3, truba);

const corndog2 = {
  'X': 'cFX[-FX][+FX]',
  'F': 'FF',
};
// x = wd/1;
// y = hg/1;
// angle = 30;
// // colorStep = 0.0007;
// // preserveColor = fluba;
// colorStep = 0.009;
// preserveColor = truba;
// render(compute('[X]+[X]+[X]', corndog2, 10), 120, 0.4, fluba);

const frootloop = {
  'X': 'c[FX[-FX][+FX]]',
  'F': 'FF',
};
// x = wd/1;
// y = hg/1.2;
// colorStep = 0.04;
// preserveColor = truba;
// colorStep = 0.1;
// angle = 0;
// render(compute('X+FX+X+FX+X+FX', frootloop, 11), 60, 0.125, 1500);

const curly = {
  'X': 'cF+[[Y]-X]+X',
  'Y': 'cFX+[Y-Y]+',
  'F': 'FF',
};
// x = wd/1.5;
// y = hg/2;
// render(compute('X', curly, 10), 5, 1, fluba);
// x = 1;
// y = 1;
// colorStep = 0.0007;
// render(parsleyCompute('X', curly, 11, 0.667, ['X', 'Y']), 5, 0.75, 100);

const sierpinski = {
  'X': 'cF+[X]+[X]+[X]',
  'F': 'FF',
};
// x = wd/2;
// y = hg/1.3;
// colorStep = 0.1
// render(compute('X', sierpinski, 10), 120, 1.5, 100);

const wheat = {
  'X': 'cF+[cF+X]-X[[cF+X]+cF]+X',
  'F': 'FF'
}
// x = wd/1.3;
// y = hg/4;
// colorStep = 0.007;
// preserveColor = truba;
// render(compute('X', wheat, 8), 60, 4, 200);
// render(compute('X', wheat, 7), 12, 3, 100);

const curly2 = {
  'X': 'F[+X-F]+FF[X-X]-FX[[+XF]-XF]+X',
  'F': 'FF',
}
// x = wd/1.3;
// y = hg/4;
// render(compute('X', curly2, 6), 5, 2, fluba);

const triangle = {
  'F': 'f-F-f',
  'f': 'F+f+F',
}
// x = wd/1.3;
// y = hg/7;
// render(compute('F', triangle, 10), 60, 1.3, 100);

const parsley = {
  'X': 'cF+[[X]-X]-F[-FX][+Y]+X',
  'Y': 'cF+Y[F-Y-Y][+F-Y]-Y',
  'Z': 'cF+[F+Z]-Z[[F-Z]+F]+Y-Z',
  'F': 'FF',
}
// x = wd/1.2;
// y = hg/1.5;
// colorStep = 0.01;
// preserveColor = truba;
// render(parsleyCompute('F+[X][Z]', parsley, 5, 0.667, ['X', 'Y', 'Z']), 25, 5, fluba);

const penise = {
  'X': 'FF[+FX][-FX][FX]',
  'Y': 'F[+Y-F]+FF[Y-Y]-FY[[+YF]-YF]+Y',
  'Z': 'F[-Z+F]-FF[Z+Z]+FZ[[-ZF]+ZF]-Z',
  'F': 'FF',
}
// x = wd/1.3;
// y = hg;
// angle = -90;
// render(compute('[Y][++++++++++++++++++++++++++++++++++++X][Z]', penise, 6), 5, 2, 100);


const wreathSimple = {
  'X': 'F[+Y][F+X]Z+Z',
  'Y': 'F[+FY]+[+ZF]ZX',
  'Z': '[F[F-Z][F+X]Y]',
  'F': 'FF+[X]Z[Y]',
}
// x = wd;
// y = hg/2.25;
// render(parsleyCompute('F[+Z[X][Y]]', wreathSimple, 4, 0.67, ['X', 'Y', 'Z']), 5.5, 40, fluba);

const wreathDouble = {
  'X': 'cF[+Y][F+X]Z',
  'Y': 'cF[+FY]+[+ZF]Z',
  'Z': 'c[F[F-Z][F+X]Y]',
  'x': 'cb[-y][b-x]z-z',
  'y': 'cb[-by]-[-zb]z',
  'z': 'c[b[b+z][b-x]y]',
  'F': 'FF+[X]Z[Y]',
  'b': 'bb-[x]z[y]',
}
// x = wd/0.9;
// y = hg/2;
// colorStep = 0.07
// render(stochasticCompute('[Z[X][Y]][z[x][y]]', wreathDouble, 5, 0.33, ['X', 'Y', 'Z', 'x', 'y', 'z']), 4.5, 20, 100);


const tootloop = {
  'X': 'x[FX[+FY+FY]]',
  'Y': 'y[FY[-FX]F[-FX]]',
  'x': 'F+y',
  'y': '-Fx',
  'F': 'cFF',
  'Q': 'FFF',
};
// x = wd/1;
// y = hg/1.2;
// colorStep = 0.001;
// preserveColor = truba;
// angle = 0;
// render(compute('X+FX+FX+FX+FX+FX+Q', tootloop, 10), 30, 0.125, 1500);

const bluflowa = {
  'X': 'cF[F+X+FX]-cF[F-X]F[+cF+X]',
  'F': 'FF',
};
// x = wd/1;
// y = 0;
// colorStep = 0.01;
// preserveColor = truba;
// angle = 0;
// render(compute('++++++X', bluflowa, 11), 15, 0.125, 1500);

const pastelflowa = {
  'X': 'cF[F+X+FX]-cF[F-X]F[+cF+X]',
  'F': 'FF',
};
// x = wd;
// y = 0;
// colorStep = 0.0000002;
// preserveColor = fluba;
// angle = 0;
// render(compute('++++++X', pastelflowa, 11), 15, 0.125, 1500);

const virtua = {
  'X': 'cF[+XF]F+F-[-YF]+F',
  'Y': 'cFF[-FX]+F[+XY]',
  'F': 'FF',
};
// x = wd/3;
// y = hg/1.25;
// colorStep = 0.0001;
// preserveColor = fluba;
// angle = 0;
// render(compute('X', virtua, 16), 60, 0.0125, 1500);
