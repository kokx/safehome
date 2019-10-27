require('dotenv').config();
const express = require('express');
const request = require('request');
const fs = require('fs');

const app = express();


setInterval(() => {
    request(process.env.CAMERA_URL, {encoding: 'binary'}, (_error, _response, body) => {
        date = new Date();
        filename = 'cam-' + date.toISOString() + '.jpg';
        fs.writeFile('result/' + filename, body, 'binary', _ => null);
    });
}, 2000);
