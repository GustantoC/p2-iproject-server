if (process.env.NODE_ENV === 'production') {
  require('dotenv').config()
}
var CronJob = require('cron').CronJob;
const express = require('express')
const cors = require('cors')
const router = require('./routes');

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', router)

var job = new CronJob({
  cronTime: '0 1 * * *', // every 24 hours
  onTick: function () {
    
  },
  start: true,
  timezone: "America/Sao_Paulo"
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:port`)
})