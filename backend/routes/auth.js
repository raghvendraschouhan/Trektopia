const express = require('express');
const User = require('../models/User')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const Jwt_sec = "GamersUnite@$7"
//Route 1 - Create User
router.post('/Createuser', [
    body('name', 'Enter a valid Name').isLength({ min: 3 }),
    body('email', 'Enter a valid Email').isEmail(),
    body('password', 'Password Length is too Short').isLength({ min: 8 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({success, errors: errors.array() });
    };
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({success,error: "Sorry a User with this email already exist" })
        }
        console.log(" iii")
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, Jwt_sec)
        success=true
        res.json({ success,authtoken })
    } catch (error) {
        console.error(error.massage);
        res.status(500).json({success,error:"Some Error Ocurred"});
    }
})
//Route 2 - login 
router.post('/login', [
    body('email', 'Enter a valid Email').isEmail(),
    body('password', "Password cannot be Blank").exists(),
], async (req, res) => {
    let success=false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() })
    };
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status.json({success,error: "Please try to login with correct cridentials" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password)
        if (!passwordCompare) {
            return res.status.json({success ,error: "Please try to login with correct cridentials" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, Jwt_sec)
        let success = true;
        res.json({ success,authtoken })

    } catch (error) {
        return res.status(500).json({success,error:"Internal Server Error Ocurred"});
    }
})
//Route 3 Get user Details
router.post('/getuser',fetchuser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user)
    } catch (error) {
        console.error(error.massage);
        res.status(500).send("Internal Server Error Ocurred");
    }
})
module.exports = router