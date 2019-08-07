const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});

async function executeQuery(query) {
    try {
        const client = await pool.connect()
        const result = await client.query(query);
        const results = { 'results': (result) ? result.rows : null };
        client.release();
        return results;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function getAlllTickets(req, res) {
    return res.json(executeQuery('SELECT * FROM tickets'));
}

async function getTickets(req, res) {
    console.log(req);
    return res.json(executeQuery('SELECT * FROM tickets'));
}

module.exports = {
    getAlllTickets,
    getTickets
}