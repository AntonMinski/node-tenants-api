const Schema = require('../models/user.schema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();

// user authentication
const signIn = (req, res) => {
    // validate request
    let {email,password} = req.body;
    if (!email) return res.status(400).send({ message: 'Email must be filled !' });
    if (!password) return res.status(400).send({ message: 'Password must be filled !' });
    if (password.length < 8) return res.status(400).send({ message: 'Password must be equal or more than 8 character !' });
    // check email already exist or not
    try {
        Schema.findOne({ email: email }).then((user)=>{
            if (!user) {
                return res.status(404).send({ message: 'Email not found, please register!.'}); 
            }
            else if (user) {
                // comparing passwords
                const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
                if (!passwordIsValid) {
                    return res.status(401).send({
                        message: 'Email registered, but password is wrong.',
                        token: null,
                    });
                }
                else if (passwordIsValid) {
                    // sign in token create from user id, 1 day expire
                    const accessToken = jwt.sign(
                        {id: user._id},
                        process.env.JWT_SECRET,
                        {expiresIn: 86400},
                    );
                    return res.status(200).send({
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        },
                        token: accessToken,
                    });
                }
            }
        })
    }
    catch(err) { return res.status(500).send({ message: err || 'An error occured.'}); }
}


const signOut = (req, res) => {
    const authHeader = req.headers['authorization']; // header and authHeader are same
    const token = authHeader.split(' ')[1];

    if (!token) { return res.status(403).send({message: 'user not logged in'}); }

    jwt.sign(token, "", { expiresIn: 1 } , (logout, err) => {
        if (logout) {
            res.status(200).send({message: 'You have been Logged Out'});
        } else {
            res.send({message: 'Error: ' + err});
        }
    });
}


// user authorization with verify the access token
const verifyToken = (req, res) => {
    const authHeader = req.headers['authorization']; // header and authHeader are same
    const token = authHeader.split(' ')[1];
    // validation
    if (!authHeader) { return res.status(403).send({message: 'request header undefined'}); }
    // convert token to json (decoded)
    const decodedResult = jwt.verify(token, process.env.JWT_SECRET);
    Schema.findOne({ _id: decodedResult.id }).then(user => {
        return res.status(200).send({
            message: 'user verified',
            name: user.name,
        });
    }).catch(err => { 
        return res.status(401).send({message: `invalid token: ${err}`});
    });
};


const register = (req, res) => {
    // validate requests
    let {name,email,password,gender,role} = req.body;
    console.log(req.body);
    if (!req.body) return res.status(400).send({ message:"Content can not be empty!" });
    if (!req.body.name) return res.status(400).send({ message:"Name can not be empty!" });
    if (!req.body.email) return res.status(400).send({ message:"Email can not be empty!" });
    if (!req.body.password) return res.status(400).send({ message:"Password can not be empty!" });
    if (req.body.password.length < 8) return res.status(400).send({ message: 'Password must be equal or more than 8 character!' });
    // check if email already exist
    try {
        Schema.findOne({ email }).then((user)=>{
            if (!user) {
                // convert password to hashed
                const encryptedPassword = bcrypt.hashSync(password, 10);
                // initialize newUser data
                const newUser = new Schema({
                    name: name,
                    email: email,
                    password: encryptedPassword,
                });

                newUser.save().then(user => {
                    // auto sign in, create token from user id
                    const accessToken = jwt.sign(
                        {id: user._id}, process.env.JWT_SECRET, {expiresIn: 86400},
                    );

                    return res.status(200).send({
                        message: 'User registered successfully!',
                        user: {
                            id: user._id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        },
                        token: accessToken,
                    });
                }).catch(err => {
                    console.log(err)
                    return res.status(500).send({ message: err.message || 'Register fail.' });
                });
            }
            else if (user) { return res.status(409).send({ message: 'Email have been registered, please login.' }); }
        })
    }
    catch(err) { return res.status(500).send({ message: err || 'Error registering the user'}); }
}

// sign up
router.post('/register', register);
// sign in
router.post('/login', signIn);
// verify token
router.get('/verify', verifyToken);
// logout
router.get('/logout', signOut);

module.exports = router;