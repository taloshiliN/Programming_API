
// index.js
const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// User registration endpoint
app.post('/api/users', async (req, res) => {
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
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
