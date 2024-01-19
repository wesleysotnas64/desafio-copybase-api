import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify();
const database = new DatabasePostgres;

server.post('/video', async (request, reply) => {

    const { title, description, duration } = request.body;

    await database.create({
        title,
        description,
        duration,
    });

    return reply.status(201).send();
});

server.get('/video', async () => {
    const videos = await database.list();

    return videos;
});

server.put('/video/:id', async (request, reply) => {
    const videoId = request.params.id;

    const { title, description, duration } = request.body;

    await database.update(
        videoId,
        {
            title,
            description,
            duration,
        }
    );

    return reply.status(204).send();
});

server.delete('/video/:id', async (request, reply) => {
    const videoId = request.params.id;

    await database.delete(videoId);

    return reply.status(204).send();
});

server.listen({
    port: process.env.PORT ?? 3333,
});