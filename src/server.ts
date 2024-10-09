import express from "express";

const port = 3000;
const app = express();

app.get("/", (req, res) => {
    res.send("Home Page");
});

app.get("/movies", (req, res) => {
    res.send("Lista de filmes");
});

app.listen(port, () => {
    console.log(`Servidor em execução na porta http://localhost:${port}`);
});