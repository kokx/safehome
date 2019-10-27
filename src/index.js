const express = require('express');
require('dotenv').config();

const app = express();


setInterval(() => {
    console.log('Test');
    // save camera image
}, 1000);
