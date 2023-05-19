// import * as tone from '/haromizor/node_modules/tone/build/Tone.js';
// import * as MidiWriter from '/haromizor/node_modules/midi-writer-js/build/index.browser.js';
import MidiWriter from '/haromizor/node_modules/midi-writer-js/build/index.browser.js';

import getMelodyBuckets from '/haromizor/js/harmonize.js'

// const fmSynth = new Tone.FMSynth().toDestination();
// const polySynth = new Tone.PolySynth().toDestination();

const chordNotes = [
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2',
    'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3',
    'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
];

const melodyNotes = [
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4',
    'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
];

// rewite the chord in root position
function rewiteChord(chord) {
    const transposed = chord.slice();
    for (let i = 1; i < transposed.length; i++) {
        while (transposed[i] < transposed[i-1]) {
            transposed[i] += 12;
        }
    }
    return transposed
}

function randomChordDuration() {
    const choices = [{
        duration: '16',
        wait: 'd8',
    }, {
        duration: 'd8',
        wait: '16',
    }];

    return choices[Math.floor(Math.random()*choices.length)];
}

// TODO: support for any n
function getDuration(len, n) {
    if (len == 1) {
        return '4';
    } else if (len == 2) {
        return '8';
    } else if (len == 3) {
        return '8t';
    } else if (len == 4) {
        return '16';
    } else if (len == 5) {
        if (n < 2) {
            return '16';
        } else {
            return '16t';
        }
    }
}

function randomMelody(len) {
    const melody = [];

    for (let i = 0; i < len; i++) {
        melody.push(Math.floor(Math.random()*12));
    }

    console.log(melody);
    return melody;
}

export function harmonizerStart () {
    const chordTrack = new MidiWriter.Track();
    const melodyTrack = new MidiWriter.Track();

    
    melodyTrack.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
    const notesToPlay = getMelodyBuckets(randomMelody(128));
    console.log(notesToPlay);

    for (let i = 0; i < notesToPlay.melodyBuckets.length; i++) {
        const melodyBucket = notesToPlay.melodyBuckets[i];
        const chord = notesToPlay.chords[i];

        for (let j = 0; j < melodyBucket.length; j++) {
            const melodyNote = melodyBucket[j];
            const melodyEvent = new MidiWriter.NoteEvent({
                pitch: melodyNotes[melodyNote],
                duration: getDuration(melodyBucket.length, j),
            });
            melodyTrack.addEvent(melodyEvent);
        }

        if (i == 0) {
            const chordEvent = new MidiWriter.NoteEvent({
                pitch: rewiteChord(chord).map(n => chordNotes[n]),
                duration: '16',
                wait: '16'
            });
            chordTrack.addEvent(chordEvent);
        } else {
            const rcd = randomChordDuration()
            const chordEvent = new MidiWriter.NoteEvent({
                pitch: rewiteChord(chord).map(n => chordNotes[n]),
                duration: rcd.duration,
                wait: rcd.wait,
            });
            chordTrack.addEvent(chordEvent);
        }
        

    }

    // Generate a data URI
    const write = new MidiWriter.Writer(chordTrack);
    console.log(write.dataUri());
    const write2 = new MidiWriter.Writer(melodyTrack);
    console.log(write2.dataUri());

}

// melodyBuckets:
//     [0], [9],
//     [1, 7, 2], [8],
//     [5, 0], [6],
//     [0], [5],
//     [8], [4],
//     [1, 0], [7],
//     [3], [10],
//     [7]
// chords:
//     [0, 4, 7], [5, 9, 0],
//     [2, 5, 8], [0, 4, 7],
//     [5, 9, 0], [7, 11, 2],
//     [0, 4, 7], [5, 9, 0],
//     [11, 2, 6], [0, 4, 7],
//     [4, 7, 10], [7, 11, 2],
//     [0, 4, 7], [4, 7, 10],
//     [7, 11, 2]