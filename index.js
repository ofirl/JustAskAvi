const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false
});


express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/about', (req, res) => res.json({hello :'world'}))
  .get('/getalltickets', (req, res) => res.json([{hello :'world'}, {id : 2}]))
  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      console.log(client);
      const result = await client.query('SELECT * FROM tickets');
      console.log(result);
      const results = { 'results': (result) ? result.rows : null};
      console.log(results);
      res.render('pages/db', results );
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
