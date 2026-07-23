const express = require('express');
const fs = require('fs');

const app = express();
const port = 8080;

// Fix 'Fingerprinting' security hotspot
app.disable('x-powered-by');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let leakedPasswords = [];
try {
    leakedPasswords = fs.readFileSync('10-million-password-list-top-1000.txt', 'utf8')
        .split('\n').map(p => p.trim()).filter(p => p.length > 0);
} catch (e) {
    console.log("Password file missing, continuing without leaked password check.");
}

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check specific admin credentials first
    if (username === 'admin' && password === '2402041@SIT.singaporetech.edu.sg') {
        return res.redirect('/welcome.html');
    }

    // 1. Length check
    if (!password || password.length < 8 || password.length > 64) {
        return res.send(`<h2>Login Failed</h2><p>Password must be between 8 and 64 characters.</p>`);
    }

    // 2. Complexity check
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
        return res.send(`<h2>Login Failed</h2><p>Password must contain at least one letter and one number.</p>`);
    }

    // 3. Leaked password check
    if (leakedPasswords.includes(password)) {
        return res.send(`<h2>Login Failed</h2><p>This password is too common or has been leaked.</p>`);
    }

    res.redirect('/welcome.html');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
