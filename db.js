// db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: `postgres://${process.env.SUPABASE_USER}:${process.env.SUPABASE_PASSWORD}@ztuqcmzavvmfornraavo.supabase.co:5432/postgres`
});


module.exports = pool;
