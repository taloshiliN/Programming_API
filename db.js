// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: `postgres://${process.env.SUPABASE_URL}:${process.env.SUPABASE_KEY}@db.your-supabase-url.supabase.co:5432/postgres`
});

module.exports = pool;
