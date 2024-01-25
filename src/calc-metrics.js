export const calcularMRR = (assinantes) => {
    const mrr = assinantes.reduce((totalMRR, assinante) => {
        if (assinante.status === 'Ativa') {
            totalMRR += parseFloat(assinante.valor);
        }
        return totalMRR;
    }, 0);

    return parseFloat(mrr.toFixed(2));
};

export const calcularChurnRate = (dados) => {

    const assinantesCancelados = dados.filter((assinante) => assinante.status === 'Cancelada');

    const numeroCancelamentos = assinantesCancelados.length;
  
    const numeroAssinantesInicial = dados.length;
  
    const churnRate = Number(((numeroCancelamentos / numeroAssinantesInicial) * 100).toFixed(2));
  
    return {
        churnRate,
        numeroCancelamentos,
        numeroAssinantesInicial,
    };
}