class Filas {
    constructor() {
        var contador;
        var inicio;
        var final;
        this.contador = 0;
        this.inicio = 0;
        this.final = 0;
    }
    GetContador = function () {
        return contador;
    }
    Enqueue = function (dado) {
        // Cria um nó com o dado
        let node = {
            dado: dado,
            // Os próximos pontos serão para valorizar de maneira linear
            // Se o início está vazio (null), não será um problema
            proximo: inicio
        };
        // Se é o primeiro item a ser inserido na lista
        // o início será o final
        if (inicio === null) {
            tail = node;
        }
        // define o nó como o novo início
        inicio = node;
        //incrementa o contador
        contador++;
    }
    Dequeue = function () {
        // Se a fila está vazia, retorna null
        if (contador === 0) {
            return;
        } else {
            let atual = inicio;
            let anterior = null;
        }
        // Enquanto houver um próximo, ele avançará a fila
        // A ideia é ter um atual no final e um anterior
        while (atual.proximo) {
            anterior = atual;
            atual = atual.proximo;
        }
        // se há mais que 1 item, 
        // remove o final e decrementa o contador em 1
        if (contador > 1) {
            // remove a referência ao último nó.
            anterior.proximo = null;
            // torna o nó anterior como final da lista
            final = anterior;
        }
        // Reseta a fila
        else {
            inicio = null;
            final = null;
        }
    }
    DisplayAll = function () {
        // Se não há nada no início, nada será retornado
        if (inicio === null) {
            return null;
        } else {
            let arr = new Array();
            let atual = inicio;
            for (let i = 0; i < contador; i++) {
                arr[i] = atual.dado;
                atual = atual.proximo;
            }
            return arr;
        }
    }
    PeekAt = function (index) {
        // Qualquer coisa menor que 0 e igual ou maior que a contagem não está na fila
        if (index > -1 && index < contador) {
            let atual = inicio;
            // Navega pela fila para achar o item
            for (let i = 0; i < index; i++) {
                atual = atual.proximo;
            }
            return atual.dado;
        }
        // Um index fora dos limites da fila foi escolhido
        else {
            return null;
        }
    }
}
let Fila = new Filas();  // Pilha de pedido
module.exports = {
   //Fila:Fila
}
