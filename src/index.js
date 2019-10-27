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

setInterval(() => {
    request(process.env.CAMERA_URL, {encoding: 'binary'}, (_error, _response, body) => {
        date = new Date();

        dir = date.getUTCFullYear() + '/'
            + date.getUTCMonth() + '-' + date.getUTCDate() + '/'
            + date.getUTCHours();

        filename = 'cam-' + date.toISOString() + '.jpg';
        fs.mkdir('data/' + dir, { recursive: true }, () => {
            fs.writeFile('data/' + dir + '/' + filename, body, 'binary', _ => null);
        });
    });
}, 2000);
