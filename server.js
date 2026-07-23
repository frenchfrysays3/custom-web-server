// import required libraries
const express = require('express');
const session = require('express-session');
const path = require('node:path');
const fs = require('node:fs');
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const dotenv = require('dotenv');

// import contents of .env to process.env
dotenv.config();

// express setup
const app = express();
const PORT = process.env.PORT || 8080;

// session setup
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // not in production
            maxAge: 1000 * 60 * 60 * 24 // how long cookie lives: 24 hours
        }
    })
);

// required for parsing JSON payloads
app.use(express.json());
// required for parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});