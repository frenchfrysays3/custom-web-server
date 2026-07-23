const express = require('express');
const session = require('express-session');
const path = require('node:path');
const fs = require('node:fs');
const bcrypt = require('bcrypt');
const chalk = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

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
