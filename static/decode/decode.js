const csvparse = require('csv-parse/sync');
const { random } = require('lodash');

const modes = [
    "poetry",
    "2010s",
    "2000s",
    "1990s",
    "1980s",
];

async function getRandomPoem () {
    try {
        const res = await fetch("https://poetrydb.org/random/10");
        if (!res.ok) {
            throw new Error(`mldb might be down, could not reach ${url}`);
        }

        const poems = await res.json();
        let minLength = Infinity;
        let minPoem = null;
        for (const poem of poems) {
            const linecount = parseInt(poem.linecount);
            if (linecount < minLength) {
                minLength = linecount;
                minPoem = poem;
            }
        }

        return minPoem.lines.join('\n').toUpperCase();
    } catch (error) {
        console.error(error);
        return null;
    }

}

async function getDict() {
    const filen = `https://psychoca.de/decode/12dicts_2of12.txt`;
    try {
        const res = await fetch(filen);
        if (!res.ok) {
            throw new Error(`Could not find file: ${filen}`)
        }
        const dict = await res.text();
        return dict.split('\r\n');
    } catch (error) {
        console.error(error);
        return null;
    }
}

function processDict(wordList) {
    const byLength = {};
    for (let word of wordList) {
        const l = word.length;
        if (typeof byLength[l] === "undefined") {
            byLength[l] = [];
        }

        byLength[l].push(word.toUpperCase());
    }

    return byLength;
}

async function readCSV(name) {
    const filen = `https://psychoca.de/decode/songbanks/${name}.csv`;
    try {
        const res = await fetch(filen);
        if (!res.ok) {
            throw new Error(`Could not find file: ${filen}`)
        }
        const csv = await res.text();
        const records = csvparse.parse(csv, {
            skip_empty_lines: true
        });
        return records
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getLyrics(artist, title) {
    const artistNoFeats = artist.toLowerCase().split('feat')[0];
    const artist_slugified = artistNoFeats.split(' ').join('+');
    const title_slugified = title.split(' ').join('+');
    const url = `https://www.mldb.org/search?mq=${artist_slugified}+${title_slugified}&si=0&mm=0&ob=1`;

    let html = "";
    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error(`mldb might be down, could not reach ${url}`);
        }

        html = await res.text();
    } catch (error) {
        console.error(error);
        return null;
    }

    const lyrics_raw = html.split('<p class="songtext" lang="EN">')[1].split('</p>')[0];
    const lyrics_stripped = lyrics_raw.replace(/\[.*\]/gm, '').replaceAll('\n', '');
    
    const stanzas = lyrics_stripped.toUpperCase().split(/(<BR \/>){2,3}/gm).map(e => e.replaceAll('<BR />', '\n')).filter(e => e != '\n');

    return stanzas;
}

function analyzeLyrics(stanzas) {
    // Find the chorus
    const uniq_stanzas = stanzas.filter((e, i) => stanzas.indexOf(e) == i);
    const stanza_ct = {};
    for (const u of uniq_stanzas) { stanza_ct[u] = 0; }
    for (const s of stanzas) { stanza_ct[s] += 1; }


    // TODO: keep track of second-most count stanza for breakdown?
    let max_stanzas = [];
    let max_stanza_ct = 0;

    for (const u of uniq_stanzas) {
        if (stanza_ct[u] > max_stanza_ct) {
            max_stanzas = [u];
            max_stanza_ct = stanza_ct[u];
        } else if (stanza_ct[u] == max_stanza_ct) {
            max_stanzas.push(u);
        } else {
            continue;
        }
    }
    

    let songParts = {}

    if (!max_stanzas.includes(stanzas[0])) {
        songParts.intro = stanzas[0];
    }

    if (max_stanzas.length == 1) {
        songParts.chorus = max_stanzas[0];
    } else if (max_stanzas.length == 2 || max_stanzas.length == 3) {
        songParts.preChorus = max_stanzas[0];
        songParts.chorus = max_stanzas[1];
        if (max_stanzas.length > 2) {
            songParts.postChorus = max_stanzas.slice(2).join('\n');
        }
    } // else there probably isn't a verse-chorus structure

    // max_stanzas.includes(stanzas.slice(-1)) does not work for reasons I cannot comprehend
    songParts.outro = stanzas.slice(-1);
    for (let s of max_stanzas) {
        if (s == songParts.outro) {
            delete songParts.outro;
            break;
        }
    }

    return songParts;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function encrypt (text) {
    const alphabet = 'QWERTYUIOPASDFGHJKLZXCVBNM'.split('');
    shuffle(alphabet);
    const encoding = {};
    for (let i = 0; i < alphabet.length; i++) {
        encoding[alphabet[i]] = i;
    }

    const encode = function(char) {
        if (typeof encoding[char] === 'undefined') {
            return char;
        } else {
            return encoding[char];
        }
    }

    const hide = function(char) {
        if (typeof encoding[char] === 'undefined') {
            return char;
        } else {
            return '.';
        }
    }
    
    const encodedText = text.split('').map(encode);
    return {
        encoding,
        encodingArr: alphabet,
        text,
        encodedText,
    }
}


// NOTE: when a word is solved, you can consider all letters in that word to be "revealed"
// -> need to keep track of revealed letters and solved letters separately
function runRevealProcedure (revealed, inferred, text, dict) {
    const unrevealedSet = new Set();
    for (let letter of text) {
        if (letter.match(/[A-Z]/gm)) {
            unrevealedSet.add(letter);
        }
    }
    const unrevealed = Array.from(unrevealedSet);
    shuffle(unrevealed);

    let revealedTotal = Array.from(new Set(revealed + inferred));
    let { maxLetters, wordsByLetter} = phraseIsSolvable(revealedTotal, text, dict);
    let sanity = 50;
    while (maxLetters !== undefined && sanity > 0) {
        // if maxLetters is not === true, it must be an array
        if (maxLetters.length == 0) {
            // no one letter will solve any word, reveal a letter at random
            const randomLetter = unrevealed.pop();
            revealed.push(randomLetter);
        } else {
            // pick a letter at random
            const notSoRandomLetter = maxLetters[Math.floor(Math.random() * maxLetters.length)];
            const i = unrevealed.indexOf(notSoRandomLetter);
            unrevealed.splice(i, 1);
            revealed.push(notSoRandomLetter);
            for (let word of wordsByLetter[notSoRandomLetter]) {
                const wordLetters = word.split('');
                for (let letter of wordLetters) {
                    inferred.push(letter);
                }
            }
            inferred = Array.from(new Set(inferred));
        }

        revealedTotal = Array.from(new Set(revealed + inferred));
        ({ maxLetters, wordsByLetter } = phraseIsSolvable(revealedTotal, text, dict));
        
        sanity -= 1;
    }
}

function phraseIsSolvable (revealedAndInferred, text, dict) {
    // split phrase into words. split on ' ' or '\n'
    const wordsHidden = [];
    const wordsText = [];
    let _wordHidden = '';
    let _wordText = '';

    for (let i = 0; i < text.length; i++) {
        if (text[i] == ',' || text[i] == '.') {
            continue;
        } else if (text[i] == ' ' || text[i] == '\n') {
            wordsHidden.push(_wordHidden);
            wordsText.push(_wordText);
            _wordHidden = '';
            _wordText = '';
        } else {
            if (revealedAndInferred.indexOf(text[i]) == -1) {
                _wordHidden += '.';
            } else {
                _wordHidden += text[i];
            }
            _wordText += text[i];
        }
    }

    const letterTally = {};
    const wordsByLetter = {};
    let yesItsSolvable = true;
    for (let i = 0; i < wordsHidden.length; i++) {
        wordHidden = wordsHidden[i];
        wordText = wordsText[i];
        const lettersThatWouldSolve = wordIsSolvable(wordHidden, wordText, dict);
        if (lettersThatWouldSolve === true) {
            if (wordsByLetter[''] === undefined) { wordsByLetter[''] = []; }
            wordsByLetter[''].push(wordText);
            continue;
        } else {
            yesItsSolvable = false;
            for (const _letter of lettersThatWouldSolve) {
                const letter = _letter;
                if (typeof letterTally[letter] === "undefined") {
                    letterTally[letter] = 0;
                }

                letterTally[letter] += 1;
                if (wordsByLetter[letter] === undefined) { wordsByLetter[letter] = []; }
                wordsByLetter[letter].push(wordText);
            }
        }
    }

    if (yesItsSolvable) {
        return true;
    } else {
        maxLetters = [];
        maxLetterCt = 0;
        for (let letter in letterTally) {
            if (letterTally[letter] > maxLetterCt) {
                maxLetterCt = letterTally[letter];
                maxLetters = [letter];
            } else if (letterTally[letter] == maxLetterCt) {
                maxLetters.push(letter);
            } else {
                continue;
            }
        }

        return {
            maxLetters,
            wordsByLetter
        };
    }
}

// input of form ("cou..n'.", "couldn't", {1: [...], 2: [...], ...})
// Can make this smarter in several ways. from easier to harder:
//  1. weed out candidates that include reavealed letters that aren't in this word
//  2. use the fact that you know some letters must be the same
//  3. correlate across other words that share the letter you're guessing
function wordIsSolvable(pattern, word, dict) {
    const checkMe = function(_pattern) {
        // escape special characters in pattern e.g. '('
        // probably most of these won't appear in lyrics but might as well be safe
        const escaped = _pattern.replace(/[*+?^${}()|[\]\\]/g, '\\$&');
        const re = new RegExp(escaped, 'gm');

        const wordList = dict[word.length];
        const matches = wordList.filter(e => e.match(re) !== null);

        // Note: the word might not appear in the dictionary, in which case we consider it solved
        if (matches.length <= 1) {
            return true;
        } else {
            return false;
        }
    }

    const solved = checkMe(pattern);
    if (solved) {
        return true;
    } else {
        const lettersThatWouldSolve = new Set();
        // want to list all letters that would solve the word
        for (let i = 0; i < pattern.length; i++) {
            if (pattern[i] != '.') { continue; }

            const newPattern = pattern.slice(0,i) + word[i] + pattern.slice(i+1, pattern.length);
            const wouldSolve = checkMe(newPattern);
            if (wouldSolve) {
                lettersThatWouldSolve.add(word[i]);
            }
        }

        return Array.from(lettersThatWouldSolve);
    }
}

async function main(text, cutoff) {
    let minRevealed = Infinity;
    let minCoded = {};

    for (let i = 0; i < 10; i++) {
        const coded = encrypt(text);
    
        const allWordsTxt = await getDict();
        const dict = processDict(allWordsTxt);
    
        let revealed = [];
        runRevealProcedure(revealed, [], coded.text, dict);
        coded.revealed = revealed;
        const percentRevealed = revealLetters(coded);

        if (percentRevealed < minRevealed) {
            minRevealed = percentRevealed;
            minCoded = coded;
        }
    }

    if (minRevealed > cutoff) {
        return null;
    }
    return minCoded;
}

function revealLetters(coded) {
    let nRevealed = 0;
    const text = coded.text.split('');
    for (let i = 0; i < text.length; i++) {
        if (coded.revealed.indexOf(text[i]) != -1) {
            coded.encodedText[i] = text[i];
            nRevealed += 1;
        }
    }

    return nRevealed/text.length;
}

async function getDataForPage(params) {
    let csvName = "poetry";
    if (JSON.stringify(params) !== "{}") {
        csvName = params.mode;
    }

    let coded = null;
    while (coded === null) {
        let content = "";
        if (csvName == "poetry") {
            content = await getRandomPoem();
        } else {
            const csvData = await readCSV(csvName);
            shuffle(csvData);
            const row = csvData.pop();
            const stanzas = await getLyrics(row[2], row[1]);
            const songParts = analyzeLyrics(stanzas);
            content = songParts.chorus;
        }

        if (csvName == "poetry") {
            coded = await main(content, 0.2);
        } else {
            coded = await main(content, 2); // no limit
        }
    }

    // Want to modify the structure of coded.text and coded.encodedText
    // so it's easier to display with ejs

    coded.encodedText = coded.encodedText.map(e => isNaN(parseInt(e)) ? -1 : e);

    const structuredText = [];
    const structuredEncoded = [];

    let currentWord = [];
    let currentLine = [];
    let currentWordEnc = [];
    let currentLineEnc = [];
    for (let i = 0; i < coded.text.length; i++) {
        if (!coded.text[i].match(/[A-Z\-'\n]/gm)) {
            currentWord.push(coded.text[i]);
            currentWordEnc.push(coded.encodedText[i]);

            currentLine.push(currentWord);
            currentLineEnc.push(currentWordEnc);

            currentWord = [];
            currentWordEnc = [];
        } else if (coded.text[i] == '\n' || i == coded.text.length-1) {
            if (currentLine.length > 0) {
                structuredText.push(currentLine);
                structuredEncoded.push(currentLineEnc);
            }
            currentLine = [];
            currentLineEnc = [];
        } else {
            currentWord.push(coded.text[i]);
            currentWordEnc.push(coded.encodedText[i]);
        }
    }

    return {
        modes,
        selected: csvName,
        revealed: coded.revealed,
        encodingArr: coded.encodingArr,
        text: structuredText,
        encodedText: structuredEncoded,
    }
}

module.exports = {
    getDataForPage,
};