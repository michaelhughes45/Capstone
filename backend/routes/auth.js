const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const multer = require('multer')

const User = require('../models/User')
const  storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })


/* User Register */
router.post('/register', upload.single('profileImage'),async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body
        const profileImage = req.file


        if (!profileImage) {
            return res.status(400).json({ error: 'No file uploaded' })
        }
        // path to the uploaded profile photo
        // const profileImagePath = profileImage.path
        const profileImagePath = profileImage?.path.replace("public", "").replace(/\\/g, '/');

        // Check if user already exists
        const existingUser = await User.findOne({ email }).exec()
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' })
        }
        // Hash the password
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profileImagePath
        })
        // Save the user to the database
        await newUser.save()
        // send success response
        res.status(200).json({ message: 'User registered successfully', user: newUser })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Registration failed!", err })
    }
})

/* User Login */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        // Check if user exists
        const user = await User.findOne({ email }).exec()
        if (!user) {
            return res.status(400).json({ error: `User doesn't exist!` })
        } 
        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password) 
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Invalid Credentials' })
        }
        // Create JWT token
        console.log('JWT_SECRET:', process.env.JWT_SECRET); // should print your secret
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        delete user.password // Remove password from user object
        // Send success response
        res.status(200).json({ message: 'Login successful', token, user })
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: "Login failed!", err })
    }
})

module.exports = router