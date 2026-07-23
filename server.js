// import required libraries
const express = require('express');
const session = require('express-session');
const path = require('node:path');
const fs = require('node:fs');
const bcrypt = require('bcrypt');
const chalk = require('chalk');
const dotenv = require('dotenv');
const crypto = require('node:crypto');

// path to .env file
const dotenvFilePath = path.join(__dirname, '.env');
// check for .env file, if doesn't exist create it
if (!fs.existsSync(dotenvFilePath)) {
    console.log(chalk.yellow('⚠️ No .env file found. auto generating defaults...'));

    const defaultEnvContent = `PORT=8080
        SESSION_SECRET=${generateCookieSecret()}`;

    fs.writeFileSync(dotenvFilePath, defaultEnvContent, 'utf-8');
}
// import contents of .env to process.env
dotenv.config();

// setup users.json
const usersFilePath = path.join(__dirname, 'users.json');
function getUsers() {
    if (!fs.existsSync(usersFilePath)) {
        fs.writeFileSync(usersFilePath, '[]', 'utf-8');
        return [];
    }

    try {
        const rawData = fs.readFileSync(usersFilePath, 'utf-8');

        if (!rawData.trim()) {
            return [];
        }

        return JSON.parse(rawData);
    } catch (e) {
        console.error(chalk.red(`❌ Error reading or parsing users.json: ${e.message}`));
        return [];
    }
}

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

const logging = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const color = "green";

    console.log(chalk[color](`[${timestamp}] ${req.method} ${req.url} from ${req.ip}`));

    next();
};
app.use(logging);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); // send the root HTML file
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const users = getUsers();

        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(401).redirect('/login?error=1');
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(401).redirect('/login?error=1');
        }

        req.session.user = {
            username: user.username,
            loggedIn: true
        };

        res.status(200).redirect('/?login=1');
    } catch (e) {
        res.redirect('/500?error_code=signin_broke');
    }
});

app.post('/api/signup', (req, res) => {
    try {
        const { username, password } = req.body;

        const users = getUsers();

        const userExists = users.some(function(user) {
            return user.username === username;
        });

        if (userExists) {
            return res.redirect('/login?error=2');
        }

        const hashedPassword = bcrypt.hashSync(password, 10);

        const newUser = {
            username: username,
            password: hashedPassword,
            dateSignedUp: new Date().toISOString()
        };
        req.session.user = {
            username: username,
            loggedIn: true
        };

        users.push(newUser);
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf-8');

        return res.redirect('/?login=1');
    } catch (e) {
        console.log(chalk.red(`❌ error logging ${username} in! ${e.message}`));
        return res.redirect('/505?error=signin_broke');
    }
});