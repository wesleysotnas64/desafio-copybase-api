import { fastify } from 'fastify'
import { DatabasePostgres } from './database-postgres.js'
import festifyCors from '@fastify/cors'

const server = fastify();
const database = new DatabasePostgres;

server.register(festifyCors, {
    origin: true,
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
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

server.get('/desafio-copybase/revenue-from-year-and-month/:year/:month', async (request, reply) => {
    const { year, month } = request.params;

    const revenue = await database.revenueFromYearAnMonth({ year, month });
    return revenue;
});

server.get('/desafio-copybase/revenue-from-year/:year', async (request, reply) => {
    const year = request.params.year;

    const revenue = await database.revenueFromYear(year);
    return revenue;
});

server.get('/desafio-copybase/churn-rate-from-year-and-month/:year/:month', async (request, reply) => {
    const { year, month } = request.params;

    const churnRate = await database.churnRateFromYearAnMonth({ year, month });
    return churnRate;
});

server.get('/desafio-copybase/churn-rate-from-year/:year', async (request, reply) => {
    const year = request.params.year;

    const churnRate = await database.churnRateFromYear(year);
    return churnRate;
});

server.get('/desafio-copybase/churn-rate-all-months-from-year/:year', async (request, reply) => {
    const year = request.params.year;
    const churnRates = [];

    for (let month = 1; month <= 12; month++) {
        const response = await database.churnRateFromYearAnMonth({ year, month });
        churnRates.push({
            churnRate: response.churnRate,
            numeroCancelamentos: response.numeroCancelamentos,
            numeroAssinantesInicial: response.numeroAssinantesInicial
        });
    }

    return churnRates;
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

server.delete('/desafio-copybase/delete-all', async (request, reply) => {
    await database.deleteAll();

    return reply.status(204).send();
});

server.listen({
    host: "0.0.0.0",
    port: process.env.PORT ?? 3333,
    // port: 3333,
});