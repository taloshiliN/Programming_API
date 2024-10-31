// index.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const { body, validationResult } = require('express-validator');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS

// User registration endpoint
app.post('/api/users', 
    [
        body('username').isLength({ min: 3 }),
        body('email').isEmail(),
        body('password').isLength({ min: 6 }),
        // Add other validations as needed
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            username,
            email,
            password,
            first_name,
            last_name,
            institution_name,
            institution_type,
            study_year,
            major,
            bio,
            github_url,
            linkedin_url,
        } = req.body;

        try {
            // Check for existing user
            const existingUser = await pool.query('SELECT * FROM Users WHERE username = $1 OR email = $2', [username, email]);
            if (existingUser.rows.length > 0) {
                return res.status(400).json({ message: 'Username or email already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            const result = await pool.query(
                `INSERT INTO Users (username, email, password, first_name, last_name, institution_name, institution_type, study_year, major, bio, github_url, linkedin_url)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING user_id`,
                [
                    username,
                    email,
                    hashedPassword,
                    first_name,
                    last_name,
                    institution_name,
                    institution_type,
                    study_year,
                    major,
                    bio,
                    github_url,
                    linkedin_url,
                ]
            );

            const userId = result.rows[0].user_id;
            res.status(201).json({ message: 'User created successfully', userId });
        } catch (error) {
            console.error('Error creating user:', error.message); // Log the error message
            res.status(500).json({ message: 'Server error', error: error.message });
        }
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
