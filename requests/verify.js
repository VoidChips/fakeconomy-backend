const verifyUser = (pool) => (req, res) => {
    const { username } = req.body;
    let { code } = req.body;
    pool.query('SELECT email, verification_code FROM users WHERE username = $1', [username], (err, results) => {
        if (err) { throw err; }
        if (code === 'reset') {
            const email = results.rows[0].email;
            const new_code = generateVerificationCode();
            pool.query('UPDATE users SET verification_code = $1 WHERE username = $2', [new_code, username], (err, results) => {
                if (err) { throw err; }
                sendVerificationMail(email, username, new_code);
                res.send({ result: 'new code' });

            });
        }
        else {
            // code variable is a string, so it needs to be converted to a number;
            code = Number(code);
            // verify user if code is valid
            if (code === results.rows[0].verification_code) {
                pool.query('UPDATE users SET verified = TRUE WHERE username = $1', [username], (err, results) => {
                    if (err) { res.status(400).send(err); }
                    res.send({ verified: 'true' });
                })
            }
            else {
                res.status(404).send({ verified: 'false' });
            }
        }
    });
}

const generateVerificationCode = () => {
    return Math.floor(Math.random() * 999999) + 100000;
}

const sendVerificationMail = (email, username, code, nodemailer, email_config) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: email_config.address,
            pass: email_config.password
        }
    });

    const mailOptions = {
        from: `${email_config.name} <${email_config.address}>`,
        to: email,
        subject: 'Verify your account',
        text: `${username}, Your verification code is ${code}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    verifyUser: verifyUser
};