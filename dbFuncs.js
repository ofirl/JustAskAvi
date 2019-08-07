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
        console.log(results);
        client.release();
        console.log('client released!');
        return results;
    } catch (err) {
        console.error(err);
        return null;
    }
}

async function getAllTickets(req, res) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return res.json(await executeQuery('SELECT * FROM tickets'));
}

async function getTickets(req, res) {
    // get ticket by date, default : all tickets ever
    // get ticket by closed : default get all tickets no matter if closed or open
    // get by id, default : ignore id
    console.log('testing');
    //console.log(req._parsed_url);
    let array_str = decodeURI(req._parsedUrl.query).split('&');
    array_str.forEach(console.log);
    return res.json(decodeURI(req._parsedUrl.query));
    //return res.json(await executeQuery('SELECT * FROM tickets'));
}

async function toggleTicket(req, res) {
    // toggle a ticket between closed and open
    // id of the ticket will be in the body of the request
}

module.exports = {
    getAllTickets,
    getTickets,
    toggleTicket
}