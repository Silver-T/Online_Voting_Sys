const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send("Here's some text!!")
})

app.listen(3000, function () {
    console.log("App listening in to port 3000")
})