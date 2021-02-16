function compress (str) {
  str = str.toLowerCase();
  // first make a dict of letters to indices
  const dict = {};
  let base = 0;
  let keys = 'qwertyuiopasdfghjklzxcvbnm,'.split('');
  for (let c of keys) {
    if (typeof dict[c] === 'undefined') {
      dict[c] = base;
      keys.push(c);
      base += 1;
    }
  }

  let tally = 0;
  for (let i = 0; i < str.length; i++) {
    tally += dict[str[i]]*Math.pow(base, i);
  }

  let cursor = str.length-1;
  let leadingZeros = 0;
  while (str[cursor] == keys[0]) {
    leadingZeros += 1;
    cursor -= 1;
  }

  const key = leadingZeros+'/';

  const ab = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';
  function toBase (n, alphabet) {
    let out = '';
    const base = alphabet.length;
    while (n > base-1) {
      const r = n % base;
      out += ab[r];
      n = Math.floor(n/base);
    }

    return out;
  }

  const compressed = toBase(tally, ab)
  return key+compressed;
}

// const input = ['Tyler', 'Allie', 'Kyle', 'Ajmal', 'Mama', 'Ddogg', 'Stefanie', 'Haya'].join(',');
const input = 'osapiudf0-98q3w4enufjoiqawdsmuc0q9-823mufmajisodpf'
const out = compress(input);
console.log(input);
console.log(out);
