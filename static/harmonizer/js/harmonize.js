// TODO: use # / b depending on the chord
//              0    1     2    3     4    5    6     7    8     9    10    11
const notes = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];

// major TODO: minor?
// note: triggers are in the major chord, associates are jazzy, breaks are JAZZY
const functions = {
  tonic: {
    triggers: [0, 4, 7],
    7: [11],
    associates: [2, 5, 9, 11],
    breaks: [1, 3, 6, 8, 10],
  },
  subdominant: {
    triggers: [5, 9, 0],
    7: [4],
    associates: [2, 3, 4, 9],
    breaks: [1, 6, 7, 8, 10, 11],
  },
  dominant: {
    triggers: [7, 11, 2],
    7: [5],
    associates: [0, 4, 5, 6, 9],
    breaks: [1, 3, 8, 10],
  },
}

const substitutions = {
  tonic: [{
    //3min
    triggers: [4, 7, 11],
    7: [2],
    associates: [0, 2, 5, 9],
    breaks: [1, 3, 6, 8, 10],
  }, {
    //6min
    triggers: [9, 0, 4],
    7: [7],
    associates: [2, 5, 7, 11],
    breaks: [1, 3, 6, 8, 10],
  }],
  subdominant: [{
    //2min
    triggers: [2, 5, 9],
    7: [0],
    associates: [0, 1, 4, 7, 11],
    breaks: [3, 6, 10],
  }, {
    //3dim
    triggers: [4, 7, 10],
    7: [1],
    associates: [0, 1, 2, 5, 9, 11],
    breaks: [3, 6, 8],
  }, {
    //6dim
    triggers: [9, 0, 3],
    7: [6],
    associates: [5, 6, 7, 9],
    breaks: [1, 2, 4, 8, 10, 11],
  }],
  dominant: [{
    //2dim
    triggers: [2, 5, 8],
    7: [11],
    associates: [0, 1, 11],
    breaks: [3, 4, 6, 7, 9, 10],
  }, {
    //7dim
    triggers: [11, 2, 6],
    7: [8],
    associates: [4, 8, 9, 10],
    breaks: [0, 1, 3, 5, 7],
  }]
}

export default function getMelodyBuckets (rawMelody) {
  // conjecture: key doesn't matter since notes are random anyway
  // therefore, you can shift the whole row such that the melody is given wrt
  //   the key of the first note
  const originalKey = rawMelody[0];
  const melody = shiftMelody(rawMelody);

  const functionOrder = ['tonic', 'subdominant', 'dominant'];

  let melodyBuckets = [];
  let chords = [functions.tonic.triggers.slice(0, 1).concat(functions.tonic[7])];
  let currentMelodyBucket = [];

  // TODO: push whole chord definition into chords rather than just triggers, then use those instead of functions[fn]

  for (let i = 0; i < melody.length; i++) {
    const note = melody[i];

    // current chord function
    const fn = functionOrder[melodyBuckets.length % functionOrder.length];
    // next chord function
    const nf = functionOrder[(melodyBuckets.length+1) % functionOrder.length];

    // Don't want arbitrarily long melody sequences because it causes weird desyncs
    // TODO: fix the desyncs
    const randomChanceToStayOnChord = currentMelodyBucket.length < 6 && (currentMelodyBucket.length < Math.random()*4);
    if (functions[fn].triggers.indexOf(note) !== -1 || randomChanceToStayOnChord) {
      // this note is a trigger or associate of the current chord, so we stay on it
      currentMelodyBucket.push(note);
    } else if (functions[nf].triggers.indexOf(note) !== -1 || currentMelodyBucket.length >= 6) {
      // trigger the chord change
      melodyBuckets.push(currentMelodyBucket.slice());
      currentMelodyBucket = [note];
      chords.push(functions[nf].triggers.slice());
    } else if (functions[fn].breaks.indexOf(note) !== -1) {
      // need to break but next chord isn't triggered yet, gotta improvise

      // if the note is an associate of the next chord that's ok, we're just gonna be a bit jazzy
      if (functions[nf].associates.indexOf(note) !== -1) {
        melodyBuckets.push(currentMelodyBucket.slice());
        currentMelodyBucket = [note];
        chords.push(functions[nf].triggers.slice(0, 1).concat(functions[nf][7]));
      } else {
        // we will be dissonant with both the current chord and the next chord, so we have a few options
        // option 1. substitute the strong-function chord with a medium / weak one
        const subsThatWork = []
        for (let sub of substitutions[nf]) {
          // todo: generate function lines?
          if (sub.triggers.indexOf(note) != -1 || sub.associates.indexOf(note) != -1) {
            subsThatWork.push(sub);
          }
        }

        if (subsThatWork.length > 0) {
          // pick a random sub from those that work
          let i = Math.floor(Math.random()*subsThatWork.length)
          melodyBuckets.push(currentMelodyBucket.slice());
          currentMelodyBucket = [note];
          chords.push(subsThatWork[i].triggers.slice(0, 1).concat(subsThatWork[i][7]));
        } else {
          // TODO: option 2. change to a key for which the current chord has dominant function

          // TODO: option 3. play a chord that fits the note even if it isn't the right function. jazz
          
          // option 4. just deal with some dissonance
          melodyBuckets.push(currentMelodyBucket.slice());
          currentMelodyBucket = [note];
          chords.push(functions[nf].triggers.slice(0, 1).concat(functions[nf][7]));
        }
      }
    }
  }

  return {melodyBuckets, chords: chords.slice(0, -1)};
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

/*
paint the melody with function lines

when harmonizing a note
choose your function (go in order tonic, subdominant, dominant, tonic, ...)

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
