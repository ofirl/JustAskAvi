const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const dbFuncs = require('./dbFuncs');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/about', (req, res) => res.json({ hello: 'world' }))

  .get('/getalltickets', async (req, res) => dbFuncs.getAllTickets(req, res))
  .get('/gettickets', async (req, res) => dbFuncs.getTickets(req, res))

  .get('/db', async (req, res) => {
    try {
      const client = await pool.connect()
      const result = await client.query('SELECT * FROM tickets');
      const results = { 'results': (result) ? result.rows : null };
      res.render('pages/db', results);
      client.release();
    } catch (err) {
      console.error(err);
      res.send("Error " + err);
    }
  })
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
