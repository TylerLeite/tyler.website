// import * as tone from '/harmonizer/node_modules/tone/build/Tone.js';
// import * as MidiWriter from '/harmonizer/node_modules/midi-writer-js/build/index.browser.js';
import MidiWriter from '/harmonizer/node_modules/midi-writer-js/build/index.browser.js';

import getMelodyBuckets from '/harmonizer/js/harmonize.js'

// const fmSynth = new Tone.FMSynth().toDestination();
// const polySynth = new Tone.PolySynth().toDestination();

const melodyNotes = [
// const chordNotes = [
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2',
    'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3',
    'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
];

const chordNotes = [
// const melodyNotes = [
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3',
    'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4',
    'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5',
    'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
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
        duration: '8',
        wait: 'd4',
    // }, {
    //     duration: 'd8',
    //     wait: '16',
    }];

    return choices[Math.floor(Math.random()*choices.length)];
}

// TODO: support for any n
function getDuration(len, n) {
    if (len == 1) {
        return '2';
    } else if (len == 2) {
        return '4';
    } else if (len == 3) {
        return '4t';
    } else if (len == 4) {
        return '8';
    } else if (len == 5) {
        if (n < 2) {
            return '8t';
        } else {
            return '8';
        }
    } else if (len == 6) {
        return '8t';
    } else if (len == 7) {
        if (n < 2) {
            return '16t';
        } else if (n < 5) {
            return '8t'; 
        } else {
            return '16';
        }
    } else if (len == 8) {
        return '16'
    } else {
        console.error('Too many notes:', len);
        return '64';
    }
}

function randomMelody(len) {
    const melody = [];

    for (let i = 0; i < len; i++) {
        melody.push(Math.floor(Math.random()*12));
    }

    // console.log(melody);
    return melody;
}

export function harmonizerStart () {
    const chordTrack = new MidiWriter.Track();
    const melodyTrack = new MidiWriter.Track();
    
    melodyTrack.addEvent(new MidiWriter.ProgramChangeEvent({ instrument: 1 }));
    const notesToPlay = getMelodyBuckets(randomMelody(2048));
    // console.log(notesToPlay);

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
                duration: '8',
            });
            chordTrack.addEvent(chordEvent);
        } else {
            const rcd = randomChordDuration();
            const chordEvent = new MidiWriter.NoteEvent({
                pitch: rewiteChord(chord).map(n => chordNotes[n]),
                duration: rcd.duration,
                wait: rcd.wait,
            });
            chordTrack.addEvent(chordEvent);
        }
    }

    // console.log(chordTrack);

    // return midi files as data URIs
    return {
        chordMidi: new MidiWriter.Writer(chordTrack).dataUri(),
        melodyMidi: new MidiWriter.Writer(melodyTrack).dataUri(),
    }
}