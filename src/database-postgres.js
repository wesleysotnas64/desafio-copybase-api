import { calcularChurnRate, calcularMRR } from './calc-metrics.js';
import { sql } from './db.js'

export class DatabasePostgres{

    async list () {
        const assinantes = await sql`select * from dados_copybase`;

        return assinantes;
    }

    async create (assinante) {
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

        await sql`
            insert into dados_copybase (
                quantidade_cobrancas,
                cobrada_a_cada_dias,
                data_inicio,
                status,
                data_status,
                data_cancelamento,
                valor,
                proximo_ciclo,
                id_assinante
            ) values (
                ${quantidade_cobrancas},
                ${cobrada_a_cada_dias},
                ${data_inicio},
                ${status},
                ${data_status},
                ${data_cancelamento},
                ${valor},
                ${proximo_ciclo},
                ${id_assinante}
            );
        `;
    }

    async update (assinante) {
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

        await sql`
            update dados_copybase set
            quantidade_cobrancas = ${quantidade_cobrancas},
            cobrada_a_cada_dias = ${cobrada_a_cada_dias},
            data_inicio = ${data_inicio},
            status = ${status},
            data_status = ${data_status},
            data_cancelamento = ${data_cancelamento},
            valor = ${valor},
            proximo_ciclo = ${proximo_ciclo}
            where
            id_assinante = ${id_assinante};
        `;
    }

    async delete (id_assinante) {
        await sql`
            delete from dados_copybase where id_assinante = ${id_assinante};
        `;
    }

    async deleteAll () {
        await sql`
            delete from dados_copybase;
        `;
    }

    async revenueFromYearAnMonth (date) {

        const {
            year,
            month
        } = date;

        const assinantes = await sql`
            select *
            from dados_copybase
            where extract(year from data_inicio) = ${year}
            and extract(month from data_inicio) = ${month};
        `;

        return calcularMRR(assinantes);

    }

    async revenueFromYear (year) {
        const assinantes = await sql`
            select *
            from dados_copybase
            where extract(year from data_inicio) = ${year};
        `;

        return calcularMRR(assinantes);
    }

    async churnRateFromYearAnMonth(date) {
        const {
            year,
            month
        } = date;

        const assinantes = await sql`
            select *
            from dados_copybase
            where extract(year from data_inicio) = ${year}
            and extract(month from data_inicio) = ${month};
        `;

        return calcularChurnRate(assinantes);
    }

    async churnRateFromYear (year) {
        const assinantes = await sql`
            select *
            from dados_copybase
            where extract(year from data_inicio) = ${year};
        `;

        return calcularChurnRate(assinantes);
    }

}