const csvparse = require('csv-parse/sync');

const sheets = [
    "polyatomic_ions",
    "solubility",
    "solubility_quiz",
    "acids_bases",
    "organic_acids_bases",
    "elements",
    "fingerspelling",
];

async function readCSV (name) {
    const filen = `https://psychoca.de/chemstudy/csv/${name}.csv`;
    try {
        const res = await fetch(filen);
        if (!res.ok) { 
            throw new Error(`Could not find file: ${filen}`)
        }
        const csv = await res.text();
        const records = csvparse.parse(csv, {
            columns: true,
            skip_empty_lines: true
        });
        return records
    } catch (error) {
        console.error(error);
        return null;
    }
}

function generateDataGivenRow (row) {
    const headers = [];
    const data = [];

    const ids = [];
    const keys = Object.keys(row);
    for (let index = 0; index < keys.length; index++) {
        const column = keys[index];
        if (column.slice(-1) == '*') {
            headers.push({type: "id", value: column.slice(0, -1)});
            ids.push(index);
        } else if (column.slice(-1) == '&') {
            headers.push({type: "img", value: column.slice(0, -1)});
        } else if (column.slice(-1) == '?') {
            headers.push({type: "hidden", value: column.slice(0, -1)});
        } else if (column.slice(-1) == '!') {
            headers.push({type: "text", value: column.slice(0, -1)});
        } else {
            // 50% chance to hide
            let typ = "text";
            if (Math.random() < 0.5) {
                typ = "hidden";
            }
            headers.push({type: typ, value: column});
        }
        data.push(row[column]);
    }

    // keep one id, hide the rest
    const keepId = ids[Math.floor(Math.random()*ids.length)];
    for (let id in ids) {
        if (id == keepId) continue;
        headers[id].type = "hidden";
    }

    return {
        headers,
        data,
    }
}

function shuffle (array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random()*(i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

async function getDataForPage(params) {
    let csvName = "polyatomic_ions";
    if (JSON.stringify(params) !== "{}") {
        csvName = params.sheet;
    }
    const csvData = await readCSV(csvName);
    shuffle(csvData);
    const rows = csvData.map(e => generateDataGivenRow(e));
    return {
        rows,
        sheets,
        selected: csvName,
    }
}

module.exports = {
    getDataForPage,
};

