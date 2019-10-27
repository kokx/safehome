require('dotenv').config();
const express = require('express');
const request = require('request');
const fs = require('fs');

const app = express();


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
