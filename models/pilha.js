class Pilha {
    constructor() {
        this._top = null;
        this._count = 0;
    }
    GetCount = function () {
        return this._count;
    }
    Peek = function () {
        if (this._top) {
            return this._top.data;
        }
        return null;
    }
    Push(data) {
        let node = {
            data: data,
            next: null
        };
        node.next = this._top;
        this._top = node;
        this._count++;
    }
    Pop() {
        if (this._top) {
            let out = this._top;
            this._top = this._top.next;
            if (this._count > 0) {
                this._count--;
            }
            return out.data;
        }
        return null;
    }
    DisplayAll() {
        if (this._top) {
            let arr = new Array();
            let current = this._top;
            for (let i = 0; i < this._count; i++) {
                arr[i] = current.data;
                current = current.next;
            }
            return arr;
        }
        return null;
    }
}
let pilha = new Pilha();  // Pilha de pedido
let pilha2 = new Pilha(); // Pilha de envio
let pilha3 = new Pilha(); // Adiciona e excrui usuários 
let pilha4 = new Pilha(); // Pilha de análise de incoerrência
module.exports = {
    pilha: pilha,
    pilha2: pilha2,
    pilha3: pilha3,
    pilha4: pilha4
}
/*
module.exports = {
    Pilha: Pilha
}

/*
let pilha = new Pilha();
console.log(`Contagem: ${pilha.GetCount()}`);
pilha.Push(4);
console.log(`Peek: ${pilha.Peek()}`);
console.log(`Contagem: ${pilha.GetCount()}`);
pilha.Push(22);
console.log(`Contagem: ${pilha.GetCount()}`);
console.log(`Pop: ${pilha.Pop()}`);
console.log(`Pop: ${pilha.Pop()}`);
console.log(`Pop: ${pilha.Pop()}`);
console.log(`Contagem: ${pilha.GetCount()}`);
pilha.Push(1);
pilha.Push(-2);
pilha.Push(100);
pilha.Push(350);
console.log(`Todos: ${pilha.DisplayAll()}`);
*/