const express = require('express')
const app = express()
const port = 3000
var cors = require("cors");
// app.get('/', (req, res) => res.send('Hello World!'))
app.use(cors());
app.use(express.static('public'))

app.listen(port, () => console.log(`Identity Owner Webserver starting at http://localhost:${port}`))