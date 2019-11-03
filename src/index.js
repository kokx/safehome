require('dotenv').config();
const express = require('express');
const request = require('request');
const fs = require('fs');

const app = express();
const mainDir = process.cwd();

app.get('/image', (req, res) => {
    fs.readdir('data/', (_err, files) => {
        files = files.sort().reverse();
        let year = files[0];
        fs.readdir('data/' + year, (_err, files) => {
            files = files.sort().reverse();
            let monthDay = files[0];
            fs.readdir('data/' + year + '/' + monthDay, (_err, files) => {
                files = files.sort().reverse();
                let hour = files[0];
                fs.readdir('data/' + year + '/' + monthDay + '/' + hour, (_err, files) => {
                    files = files.sort().reverse();
                    let filename = mainDir + '/data/' + year + '/' + monthDay + '/' + hour + '/' + files[0];
                    console.log(filename);
                    res.sendFile(filename);
                });
            });
        });
    })
});

app.listen(5000, () => console.log('Listening...'));

let lastError = '';
let noErrors = 0;

const prependZeroes = (num, len) => {
    return ("0".repeat(len) + num).slice(-1 * len);
};

setInterval(() => {
    request(process.env.CAMERA_URL, {encoding: 'binary', timeout: 1200}, (error, _response, body) => {
        if (error) {
            noErrors = 0;
            // Only log an error if it is new
            if (error.code !== lastError) {
                console.log(new Date(), 'Camera likely offline. Reason:', error.code);
                lastError = error.code;
            }
            // in case of error, do not try to save data
            return;
        }
        if (noErrors > 5) {
            // reset lastError
            lastError = '';
        }
        noErrors++;

        date = new Date();

        dir = prependZeroes(date.getUTCFullYear(), 4) + '/'
            + prependZeroes(date.getUTCMonth(), 2) + '-' + prependZeroes(date.getUTCDate(), 2) + '/'
            + prependZeroes(date.getUTCHours(), 2);

        filename = 'cam-' + date.toISOString() + '.jpg';
        fs.mkdir('data/' + dir, { recursive: true }, () => {
            fs.writeFile('data/' + dir + '/' + filename, body, 'binary', _ => null);
        });
    });
}, 1500);
