const express = require('express');
const app =  express();


app.get('/', (req, res) => {
    res.send('Hello From YelpCamp')
})

app.listen(3000, () => {
    console.log('Serving on Port 3000')
})