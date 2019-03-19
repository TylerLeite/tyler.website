const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

// major TODO: minor?
// note: triggers are in the major chord, associates are jazzy, breaks are JAZZY
const functions = {
  tonic: { // no 2, 6, 11
    triggers: [0, 4, 7],
    associates: [9, 5],
    breaks: [1, 2, 3, 8, 10],
  },
  subdominant: { // no 6, 11, 4
    triggers: [5, 9, 0],
    associates: [10],
    breaks: [1, 3, 6, 7, 8],
  },
  dominant: { // no 0, 6, 5
    triggers: [7, 11, 2],
    associates: [4, 1],
    breaks: [3, 8, 9, 10],
  },
}


function getMelodyBuckets (rawMelody) {
  // conjecture: key doesn't matter since notes are random anyway
  // therefore, you can shift the whole row such that the melody is given wrt
  //   the key of the first note
  const melody = shiftMelody(rawMelody);

  const functionLines = generateFunctionLines(melody);
  const functionOrder = ['tonic', 'subdominant', 'dominant', 'tonic'];

  let melodyBuckets = [];
  let currentMelodyBucket = [];

  for (let i = 0; i < melody.length; i++) {
    const note = melody[i];
    // function of this note
    const fn = functionOrder[melodyBuckets.length % functionOrder.length];
    // function of the next note
    const nf = functionOrder[(melodyBuckets.length+1) % functionOrder.length];


    if (functions[nf].triggers.indexOf(note) != -1) {
      // found a tonic of the next function
      melodyBuckets.push(currentMelodyBucket.slice());
      currentMelodyBucket = [note];
    } else if (functions[fn].breaks.indexOf(note) != -1) {
      // if the current note is not in this function, you need to end the bucket

      // first check if your current bucket contains a tonic or associate of the
      // next function

      // tonic

      // associate

      // break

      // otherwise it looks like youre just gonna have to deal with dissonance
    } else {
      // otherwise it's just a note in this function
      currentMelodyBucket.push(note);
    }
  }

  return melodyBuckets;
}

function shiftMelody (melody) {
  // Change the 'key' of a melody to <first note> major
  let out = [];

  let d = melody[0];
  for (let i = 0; i < melody.length; i++) {
    out.push((melody[i] - d + 12) % 12);
  }

  return out;
}

function generateFunctionLines (melody) {
  // what is a function line? i'm glad you asked
  // you have three chord functions: [t]onic, [s]ubtonic, and [d]ominant
  // you can imagine arranging the notes of your melody in a line, then drawing
  // three lines below them labeled 't', 's', and 'd'
  // if a note isn't in a line's associated function, break the line at that point
  // now you can solve the problem of harmonizing by just changing chords when you
  // hit a break.

  // function lines look something like this ():
  //   00,09,01,07,02,08,05,00,04,06,00,02,05,03,08,09,04,02,11,01,00,07,03,10,07,03,04,
  // t ------------   ------------   ---   ---   ---------   ------------   ------   ---
  // s ---------   ---   ------------------------   ---------   ------   ------   ------
  // d    ---   ------------      ---   ---------------   ------      ---   ------   ---

  let lines = [];
  for (let i = 0; i < melody.length; i++) {
    const m = melody[i];
    let linesSegment = [
      functions.tonic.breaks.indexOf(m) == -1,
      functions.subdominant.breaks.indexOf(m) == -1,
      functions.dominant.breaks.indexOf(m) == -1,
    ];
    lines.push(linesSegment);
  }

  return lines;
}

console.log(getMelodyBuckets([0,9,1,7,2,8,5,0,4,6,0,2,5,3,8,9,4,2,11,1,0,7,3,10,7,3,4]));

/*

paint the melody with function lines

  00,09,01,07,02,08,05,00,04,06,00,02,05,03,08,09,04,02,11,01,00,07,03,10,07,03,04,
t ------------   ------------   ---   ---   ---------   ------------   ------   ---
s ---------   ---   ------------------------   ---------   ------   ------   ------
d    ---   ------------      ---   ---------------   ------      ---   ------   ---

when harmonizing a note
choose your function (go in order tonic, subdominant, dominant, tonic)

track the first associate. go until either:
  you run out of space
    if you encountered an associate for the next function, break there
    else break at the end and hope for the best
  you encounter a trigger for the next function
    break at the trigger

generate a chord from the notes you're using
  if you can, use 2 triggers and an associate
  if not, fill in the chord with notes you're playing
  if you dont have enough, pick from the list of triggers / associates
    count sharp triggers, associates as a dissonance

*/
