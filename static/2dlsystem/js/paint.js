function renderPlot (plot) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  for (let y = canvas.height-1; y >= 0; y--) {
    for (let x = 0; x < canvas.width; x++) {
      ctx.fillStyle = plot[y][x];
      ctx.fillRect(x, y, 1, 1);
    }
  }

  return 'ca$h money';
}

function paintArray (pixels) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const hg = window.innerHeight;
  const wd = window.innerWidth;
  canvas.width = wd*2;
  canvas.height = hg*2;
  canvas.style.width = wd;
  canvas.style.height = hg;

  const pwd = canvas.width / pixels[0].length;
  const phg = canvas.height / pixels.length;

  for (let i = 0; i < pixels.length; i++) {
    for (let j = 0; j < pixels[i].length; j++) {
      if (!pixels[i][j]) {
        pixels[i][j] = [0, 0, 0];
      }

      const [r, g, b] = pixels[i][j];
      if (r == 0 && g == 0 && b == 0) {
        continue;
      }

      ctx.fillStyle = `rgb(${r},${g},${b})`
      ctx.fillRect(i*pwd, j*phg, pwd, phg);
    }
  }
}

function complexToHsv (x, y, minR, maxR) {
  if (isNaN(x) || isNaN(y)) { return 'rgb(0,0,0)'}
  if (x === Infinity || y === Infinity) { return 'rgb(255,255,255)'}
  if (x === -Infinity || y === -Infinity) { return 'rgb(255,255,255)'}
  
  const r = Math.sqrt(x*x + y*y);
  const scaledR = (r - minR)/(maxR - minR);

  const theta = Math.atan2(y, x);
  let hue = 180 * theta / Math.PI;
  while (hue < 0) {
    hue = 360 + hue;
  }

  const saturation = Math.abs(Math.sin(2*Math.PI*r));

  const brightness = Math.sqrt(Math.sqrt(Math.abs(Math.sin(2*Math.PI*y)*Math.sin(2*Math.PI*x))))
  const brightness2 = 0.5 * ((1 - saturation) + brightness + Math.sqrt((1 - saturation - brightness)*(1 - saturation - brightness) + 0.01));

  return hsvToRgb(hue, saturation, brightness2);
}

function complexToHsl (x, y, minR, maxR, x0, y0) {
  if (isNaN(x) || isNaN(y)) { return 'rgb(0,0,0)'}
  if (x === Infinity || y === Infinity) { return 'rgb(255,255,255)'}
  if (x === -Infinity || y === -Infinity) { return 'rgb(255,255,255)'}

  const theta = Math.atan2(y, x);
  let hue = 180 * theta / Math.PI;
  while (hue < 0) {
    hue = 360 + hue;
  }

  const r = Math.sqrt(x*x + y*y);

  if (maxR == minR) {
    maxR += 0.0000000001; // no divide zero plz
  }
  const scaledR = (r - minR)/(maxR - minR);

  // map a complex value to hsl
  const saturation = 1;
  // bigger number in pow base = darker
  const lightness = 1 - Math.pow(0.5, r);

  return hslToRgb(hue, saturation, lightness);
}

function hslToRgb (h, s, l) {
  // convert to rgb
  const C = (1 - Math.abs(2*l - 1)) * s; // chroma
  const X = C * (1 - Math.abs((h/60)%2 - 1));
  const m = l - C/2;

  const options = [
    [C, X, 0],
    [X, C, 0],
    [0, C, X],
    [0, X, C],
    [X, 0, C],
    [C, 0, X],
    [C, 0, X],
  ];
  const H = Math.floor(h/60);

  const o = options[H].map(e => (e+m)*255);
  return `rgb(${o[0]},${o[1]},${o[2]})`;
}

function hsvToRgb (h, s, v) {
  const C = v * s;
  const X = C * (1 - Math.abs((h/60)%2 - 1));
  const m = v - C;

  const options = [
    [C, X, 0],
    [X, C, 0],
    [0, C, X],
    [0, X, C],
    [X, 0, C],
    [C, 0, X],
    [C, 0, X],
  ];
  const H = Math.floor(h/60);

  const o = options[H].map(e => (e+m)*255);
  return `rgb(${o[0]},${o[1]},${o[2]})`;
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

  return `rgb(${r}, ${g}, ${b})`;
}
