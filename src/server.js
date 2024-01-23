import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'

const server = fastify();
const database = new DatabasePostgres;

// Middleware para habilitar CORS
server.addHook('onRequest', (request, reply, done) => {
    // Permitir solicitações de qualquer origem
    reply.header('Access-Control-Allow-Origin', '*');
    // Permitir os métodos de solicitação especificados (GET, POST, PUT, DELETE)
    reply.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Permitir os cabeçalhos especificados
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
  
    // Continue para a rota ou manipulador seguinte
    done();
  });

server.post('/desafio-copybase', async (request, reply) => {

    const assinantes = request.body;

    for (const assinante of assinantes) {

        const {
            quantidade_cobrancas,
            cobrada_a_cada_dias,
            data_inicio,
            status,
            data_status,
            data_cancelamento,
            valor,
            proximo_ciclo,
            id_assinante,
        } = assinante;

        await database.create({
            quantidade_cobrancas,
            cobrada_a_cada_dias,
            data_inicio,
            status,
            data_status,
            data_cancelamento,
            valor,
            proximo_ciclo,
            id_assinante,
        });

    }

    return reply.status(201).send();
});

server.get('/desafio-copybase', async () => {
    const assinantes = await database.list();

    return assinantes;
});

server.put('/desafio-copybase', async (request, reply) => {

    const {
        quantidade_cobrancas,
        cobrada_a_cada_dias,
        data_inicio,
        status,
        data_status,
        data_cancelamento,
        valor,
        proximo_ciclo,
        id_assinante,
    } = request.body;

    await database.update({
        quantidade_cobrancas,
        cobrada_a_cada_dias,
        data_inicio,
        status,
        data_status,
        data_cancelamento,
        valor,
        proximo_ciclo,
        id_assinante,
    });

    return reply.status(204).send();
});

server.delete('/desafio-copybase/:id', async (request, reply) => {
    const id_assinante = request.params.id;

    await database.delete(id_assinante);

    return reply.status(204).send();
});

server.listen({
    host: "0.0.0.0",
    port: process.env.PORT ?? 3333,
    // port: 3333,
});