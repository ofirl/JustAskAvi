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
    return res.json(await executeQuery('SELECT * FROM tickets'));
}

async function getTickets(req, res) {
    // get ticket by date, default : all tickets ever
    // get ticket by closed : default get all tickets no matter if closed or open
    // get by id, default : ignore id
    console.log('testing');
    //console.log(req._parsed_url);
    let array_str = decodeURI(req._parsedUrl.query).split('&');
    let queryFilter = [];
    let n = 0;
    let queryJson = {};
    for (var i = 0; i<array_str.length; i++){
        let split = array_str[i].split('=');
        let key = split[0];
        let data = split[1];
        data = data.substring(1,data.length-1)
        queryJson[key] = data;
        
    }
    console.log(queryJson);
    if(queryJson.date != null){
        queryFilter[n] = "date >=" + queryJson["date"];
        n++;
    }
    if(queryJson.closed !=null){
        queryFilter[n] = "closed=" + queryJson["closed"];
        n++;
    }

    if(queryJson.id !=null){
        queryFilter[n] = "id=" + queryJson["id"];
        n++;
    }
    let filter = queryFilter.join(" AND ");
  console.log(filter);
    return res.json(decodeURI(req._parsedUrl.query));
    //return res.json(await executeQuery('SELECT * FROM tickets'));
}

async function toggleTicket(req, res) {
    // toggle a ticket between closed and open
    // id of the ticket will be in the body of the request
}

async function addTicket(req, res) {
    console.log(req);
    // toggle a ticket between closed and open
    // id of the ticket will be in the body of the request
}


module.exports = {
    getAllTickets,
    getTickets,
    toggleTicket
}