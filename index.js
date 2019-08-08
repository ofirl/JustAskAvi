const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const dbFuncs = require('./dbFuncs');

express()
  .use(express.static(path.join(__dirname, 'public')))
  .use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/about', (req, res) => res.json({ hello: 'world' }))
  .get('/getalltickets', (req, res) => dbFuncs.getAllTickets(req, res))
  .get('/gettickets', (req, res) => dbFuncs.getTickets(req, res))
  .post('/toggleticket', (req, res) => dbFuncs.toggleTicket(req, res))
  .post('/addticket', (req, res) => dbFuncs.addTicket(req, res))

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
