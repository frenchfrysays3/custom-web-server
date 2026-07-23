# Custom Web Server

A lightweight custom web server built using Express.js and Node.js v24 LTS.

## Features

- **Custom Middleware**: Styled console request logging powered by Chalk v4.
- **Dynamic Bootstrapping**: Automatically detects and configures a `.env` file containing a secure 64-digit session secret on startup.
- **Robust Routing**: Built-in static files handling and a fallback 404 page middleware layout.
- **Local Authentication Prototype**: Local storage authentication utilizing `users.json` and cryptographically secure password hashing with `bcrypt`.

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup .env file (optional)
```dotenv
PORT=port number here
SESSION_SECRET=cookie secret here
```

The system will automatically initialize a `.env` template file if one is missing.

### 3. Start the Server
Run the startup file to auto-generate configuration defaults and run the server:
```bash
node server.js
```

## Dependencies
Below is a list of dependencies this project uses:

- [Express.js](https://www.npmjs.com/package/express): the core of the server - handles routing, logging, and hosting
- [chalk](https://www.npmjs.com/package/chalk): terminal styling - handles styling of logs
- [bcrypt](https://www.npmjs.com/package/bcrypt): password hashing - handles hashing of user passwords
- [dotenv](https://www.npmjs.com/package/dotenv): secure sensitive info storing - handles the port and cookie secret (see [setting up .env file](#2-setup-env-file-optional))
- [Express.js sessions](https://www.npmjs.com/package/express-session): cookie support - handles creating and parsing cookies