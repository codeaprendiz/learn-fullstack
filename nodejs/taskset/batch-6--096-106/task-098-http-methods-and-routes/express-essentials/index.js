import express from 'express';
import data from './data/mock.json' assert {type: "json"};
const app = express();

const PORT= 3000;

app.get('/', (req, res) => {
    res.send('This is a GET request at /');
});


app.post('/create', (req, res) => {
    res.send('This is a POST request at /create');
});

app.put('/edit', (req, res) => {
    res.send('This is a PUT request at /edit');
});

app.delete('/delete', (req, res) => {
    res.send('This is a DELETE request at /delete');
});

app.listen(PORT, () => {
    console.log(`The server is listening on port ${PORT}`);
});