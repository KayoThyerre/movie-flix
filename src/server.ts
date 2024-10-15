import express from "express";
import { PrismaClient } from "@prisma/client";
import { release } from "os";

const port = 3000;
const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (_, res) => {
    res.send("Home Page");
});

app.get("/movies", async (_, res) => {
    const movies = await prisma.movie.findMany({
        orderBy: {
            title: "asc"
        },
        include: {
            genres: true,
            languages: true
        }
    });
    res.json(movies);
});

app.post("/movies", async (req, res) => {

    const { title, genre_id, language_id, oscar_count, release_date } = req.body;

    try {

        // verificar no banco se já existe um filme com o nome que está sendo enviado

        // case insensitive - não diferencia os registros maiúsculos ou minúsculos
        // case sensitive - diferencia os maiúculos e minúsculos

        const movieWithSameTitle = await prisma.movie.findFirst({
            where: { title: { equals: title, mode: "insensitive"} },
        });

        if(movieWithSameTitle) {
            return res
            .status(409)
            .send({ message: "Já existe um filme cadastrado com esse título."});
        };


        await prisma.movie.create({
            data: {
                title: title,
                genre_id: genre_id,
                language_id: language_id,
                oscar_count: oscar_count,
                release_date: new Date(release_date),
            }
        });
    } catch (error) {
        res
        .status(500)
        .send({ message: "Falha ao cadastrar um filme" });
    }

    res.status(201).send();
});

app.put("/movies/:id", async (req, res) => {
    //pegar o id do registro que será atualizado
    const id = Number(req.params.id)

    //pegar os dados do filme que será atualizado e atualizar ele no prisma
    const movie = await prisma.movie.update({
        where: {
            id
        },
        data: {
            release_date: new Date(req.body.release_date)
        }
    });

    // retornar o status correto que o filme será atualizado
    res.status(200).send();

});

app.listen(port, () => {
    console.log(`Servidor em execução na porta http://localhost:${port}`);
});