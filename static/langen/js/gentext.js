// Warning, comments removed

Array.prototype.choice = function() {
	return this[Math.floor(Math.random() * this.length)];
}

String.prototype.title = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

function make_word(syllables) {
	var chance_start_consonant = 50
	var chance_end_vowel = 50

	var c_s = "w wr r t tw th thr y p ph pr d dr f fr fl g gl gr gh h j k kl kr c ch cl cr z v b br n m s sl sk sm sn st fr l".split(' ');
	var c_m = "w ws wd wr wt wth wp wk wn wm wb r rt rp rm rn rc rb rl rk rd rs rth rch t th thr tch t ts y ys p pl pr ps s sh sch st sm sn dr ddl dd f ff fr fl mp mn gs gl j k kl kr kw l ll lm ls sl sk z zz ch cr ct cl ck v b br bs bl n ns m ms nth".split(' ');
	var c_e = "w ws wd wt wth wk r rt rp rm rn rc rb rl rk rd rs rth rch t th tch t ts y p ps s sh sch st  ff  mp gs k ll ls sk ch ct ck v b bs n ns m ms nth".split(' ');

	var v_s = "a e i o u ae ao ei eu ea oo ou oi oy ay ey y".split(' ');
	var v_m = v_s;
	var v_e = v_s;

	var out = "";
	var combos = [];

	var vowel = true;

	if (syllables != 1) {
		var rand = Math.random() * 100;
		if (rand > chance_start_consonant) {
			vowel = false;
		}
	}

	for (var i = 0; i < syllables; i++) {
		if (vowel) {
			vowel = false;
			if (i == 0) {
				out += v_s.choice();
			} else if (i == syllables - 1) {
				out += v_e.choice();
			} else {
				out += v_m.choice();
			}
		} else {
			vowel = true;
			if (i == 0) {
				out += c_s.choice();
			} else if (i == syllables - 1) {
				out += c_e.choice();
			} else {
				out += c_m.choice();
			}
		}
	}

	return out;
}

function createDictionary(syllables) {
	var dictionary = [];
	var density = 500;

	for (var i = 0; i < 100000; i++) {
		var word;
		if (Math.random()*1000 < density && dictionary.length > 0) {
			word = dictionary.choice();
		} else {
			word = make_word(syllables.choice());
		}

		dictionary.push(word);
	}

	return dictionary;
}

function genText(length, dictionary) {
	var capital = true;
	var real_out = "";
	var sentences = 0;

	for (var i = 0; i < length; i++) {
		var out = dictionary.choice();
		if (capital) {
			out = out.title();
		}

		capital = false;

		var punc = Math.floor(Math.random()*1000);
		if (i == length - 1) {
			out += ".";
		} else if (sentences == Math.floor(Math.random()*4 + 4)) {
			out += '.<br><br>';
			sentences = 0;
			capital = true;
		} else if (punc < 50) {
			out += ".";
			capital = true;
			sentences += 1;
		} else if (punc < 100) {
			out += ","
		}

		real_out += out + " ";
	}

	return real_out;
}

console.log(genText(10000, createDictionary([1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,4,4,4,4,4,5,5,5,6,6,7])));
