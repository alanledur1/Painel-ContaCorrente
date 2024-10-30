
import promptsync from 'prompt-sync';
const prompt = promptsync({ sigint: true });

import { validate } from 'bycontract';

class SaldoInsuficienteError extends Error {
    #saldoAtual;
    #retiradaDesejada;

    constructor(saldoAtual, retiradaDesejada){
        super("Saldo Insuficiente!");
        this.#saldoAtual = saldoAtual;
        this.#retiradaDesejada = retiradaDesejada;
    }

    get saldoAtual(){
        return this.#saldoAtual;
    }

    get retiradaDesejada(){
        return this.#retiradaDesejada;
    }

}

class ContaCorrente{
    #saldo;

    constructor(saldoInicial){
        validate(saldoInicial, "number");
        if (saldoInicial < 0) throw new Error("saldo inicial invalido");
        this.#saldo = saldoInicial;
    }

    deposito(valor){
        validate(valor,"number");
        if (valor < 0) throw new Error("valor do deposito invalido");
        this.#saldo += valor;
    }

    retirada(valor){
        validate(valor,"number");
        if (valor < 0) throw new Error("valor da retirada invalido.");
        if (valor > this.saldo){
            throw new SaldoInsuficienteError(this.#saldo,valor);
        }
        this.#saldo -= valor;
    }

    get saldo(){
        return this.#saldo;
    }
}


let cc = new ContaCorrente(0);
let fim = false;
while (!fim) {
    console.log('Opções:');
    console.log('1 - Depositar');
    console.log('2 - Retirar');
    console.log('3 - Ver o saldo');
    console.log('4 - Fim');
    try {
        let opcao = Number(prompt('Entre sua opção: '));
        let valor = 0;
        console.log('---------------');
        switch (opcao) {
            case 1:
                valor = Number(prompt('Qual o valor do depósito? '));
                cc.deposito(valor);
                break;
            case 2:
                valor = Number(prompt('Qual o valor da retirada? '));
                cc.retirada(valor);
                break;
            case 3:
                console.log(`Saldo: R$ ${cc.saldo.toFixed(2)}`);
                break;
            case 4:
                fim = true;
                break;
            default:
                console.log('Opção invalida');
                break;
        }
    } catch (erro) {
        if (erro instanceof SaldoInsuficienteError) {
            console.log("Saldo insuficiente:");
            console.log(`Saldo atual: R$ ${erro.saldoAtual}`);
            console.log(`Retirada pretendida: R$ ${erro.retiradaDesejada}`);
        } else {
            console.log(erro.message);
        }
    }
    console.log('---------------');
}