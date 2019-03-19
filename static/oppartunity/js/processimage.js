function processPixelArr(oldArr) {
	var newArr = [];
	for (var i = 0; i < oldArr.length; i++) {
		var rgb = oldArr[i];
		//console.log(info);
		var info = classify(rgb[0], rgb[1], rgb[2]);
		var className = mapColorToCSS(info[0], info[1]);
		newArr.push(className);
	}

	return newArr;
}

function classify(r,g,b) {
	// for shade, 0 = normal, 50 = bright, -50 = dark
	//return shade and name
	r /= 255; g /= 255; b /= 255;

	var max = Math.max(r, g, b);
	var min = Math.min(r, g, b);

	var h; var s; var v; var d;
	v = (max + min) / 2;
	d = max - min;

	if (d == 0) { // achromatic
		h = 0;
		s = 0;
	} else {
		s = max;
		if (max != 0) {
			s = d / max;
		}

		if (max == r) {
			h = 60 * (((g - b) / d) % 6);
			if (b > g) {
				h += 360;
			}
		} else if (max == g) {
			h = 60 * (((b - r) / d) + 2);
		} else if (max == b) {
			h = 60 * (((r - g) / d) + 4);
		}
	}

	h = Math.round(h * 100) / 100;
	s = Math.round(s * 100) / 100;
	v = Math.round(v * 100) / 100;

	var shade;
	if (v >= 0.8) {
		shade = 50;
	} else if (v <= 0.4) {
		shade = -50;
	} else {
		shade = 0;
	}

	if (v <= 0.15) {
		return ['black', -50];
	} else if (s <= 0.15 && v >= 0.65) {
		return ['white', 50];
	} else if (s <= 0.15 && v <= 0.65) { //gray shades are special since they make up 3 colors
		if (v >= 0.6){
			shade = 'light';
		} else if (v <= 0.25) {
			shade = 'dark';
		} else {
			shade = 'normal';
		}

		return ['gray', shade];
	} else if (((h <= 11 || h >= 351) && s >= 0.5) || ((h >= 310 && h <= 351) && s > 0.3)) {
		return ['red', shade];
	} else if (h <= 11 || h >= 351 || (h >= 310 && h <= 351)) {
		return ['pink', shade];
	} else if (h >= 11 && h <= 45 && v >= 0.3) {
		return ['orange', shade];
	} else if (h >= 11 && h <= 45 && v <= 0.3) {
		return ['brown', shade];
	} else if (h >= 45 && h <= 64) {
		return ['yellow', shade];
	} else if (h >= 64 && h <= 170) {
		return ['green', shade];
	} else if (h >= 170 && h <= 255) {
		return ['blue', shade];
	} else if (h >= 255 && h <= 310 && s >= 0.5) {
		return ['purple', shade];
	} else if (h >= 255 && h <= 310 && s <= 0.5) {
		return ['pink', shade];
	}
}

// info is a list
function mapColorToCSS(color, shade) {
	switch (shade) {
		case 'light':
			switch (color) {
				case 'black':
					return 'Black';
				case 'blue':
					return 'LightBlue';
				case 'brown':
					return 'RosyBrown';
				case 'gray':
					return 'LightGray';
				case 'green':
					return 'LightGreen';
				case 'orange':
					return 'SandyBrown';
				case 'pink':
					return 'LightPink';
				case 'purple':
					return 'MediumOrchid';
				case 'red':
					return 'Tomato';
				case 'white':
					return 'White';
				case 'yellow':
					return 'Wheat';
				default:
					return color;
			}
			break;
		case 'dark':
			switch (color) {
				case 'black':
					return 'Black';
				case 'blue':
					return 'MidnightBlue';
				case 'brown':
					return 'SaddleBrown';
				case 'gray':
					return 'DimGray';
				case 'green':
					return 'DarkGreen';
				case 'orange':
					return 'DarkOrange';
				case 'pink':
					return 'Violet';
				case 'purple':
					return 'Indigo';
				case 'red':
					return 'DarkRed';
				case 'white':
					return 'White';
				case 'yellow':
					return 'GoldenRod';
				default:
					return color;
			}
			break;
		case 'normal':
			switch (color) {
				case 'brown':
					return 'Sienna';
				default:
					return color;
			}
		default:
			return color;
	}
}
