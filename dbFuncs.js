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
        console.log("results!");
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
    console.log(req._parsedUrl.query);
 if(req._parsedUrl.query != null)  { 
    let array_str = decodeURI(req._parsedUrl.query).split('&');
    let queryFilter = [];
    let queryJson = {};
    for (var i = 0; i<array_str.length; i++){
        let split = array_str[i].split('=');
        let key = split[0];
        let data = split[1];
        data = data.substring(1,data.length-1)
        queryJson[key] = data;
        
    }
    console.log(queryJson);
    if(queryJson.time != null){
        let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let newDate = new Date(queryJson["time"]);
        var dateFormat = require('dateformat');
        newDate = dateFormat(newDate,"yyyy-mm-ddT00:00:00.000Z");
        console.log(newDate);
        queryFilter.push("time >=" + newDate);
    }
    if(queryJson.closed !=null){
        queryFilter.push("closed=" + queryJson["closed"]);
    }

    if(queryJson.id !=null){
        queryFilter.pust("id=" + queryJson["id"]);
    }
    let filter = queryFilter.join(" AND ");
  console.log(filter);
  if (filter != null){
    return res.json(await executeQuery('SELECT * FROM tickets WHERE ' + filter));
  }
}
  return getAllTickets(req, res);
    //return res.json(decodeURI(req._parsedUrl.query));
    //return res.json(await executeQuery('SELECT * FROM tickets'));
 

}

async function toggleTicket(req, res) {
    // toggle a ticket between closed and open
    // id of the ticket will be in the body of the request
    console.log(req);
    console.log(req._parsedUrl.query);
    if (req._parsedUrl.query != null){
        let array_str = decodeURI(req._parsedUrl.query).split('=');
        let id = array_str[1];
        id = id.substring(1,id.length-1);
    
    console.log("the id is: " + id);
    let isclosed = await executeQuery('SELECT closed FROM tickets WHERE id = ' + id);
    if (isclosed != null && isclosed.length > 0){
        isclosed = isclosed[0][closed];
    }
    console.log(isclosed);
    if(isclosed != null) {
        return res.json(await executeQuery('UPDATE tickets SET closed = ' + !isclosed + 
        ' WHERE id = ' + id));
    }
}
}

async function addTicket(req, res) {
    console.log("add");
    //console.log(req);
    // toggle a ticket between closed and open
    // id of the ticket will be in the body of the request
    let system = 'BW';
    let closed = false;
    var dateFormat = require('dateformat');
    var now = new Date();
    now = dateFormat(now,"yyyy-mm-dd hh:MM:ss+00Z");
    console.log(now);
    let query = "SET system = " + system + ", time = " + now + ", closed = " + closed;
    console.log(query);
    console.log("update");
    return res.json(await executeQuery('UPDATE tickets ' + query));
}


module.exports = {
    getAllTickets,
    getTickets,
    toggleTicket,
    addTicket,
    toggleTicket
}