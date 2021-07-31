//@ts-check

import { makeStore, subscribe } from './magic-tree.js'

const store = makeStore({
    name: 'Winnie',
})

function logChange(key, oldValue, newValue){
    console.log(`${key} went from ${oldValue} to ${newValue}`)
}
store[subscribe](logChange, 'name')

window.setTimeout(() => store.name = 'Porcinet', 1000)

class El{
    constructor(namesIn, namesOut){
        console.log(namesIn.map(n => n.split('/').filter(x=>x)))
    }
}

class P extends El{
    /**
     * 
     * @param {HTMLElement} parent 
     * @param {String[]} namesIn 
     * @param {String[]} namesOut 
     */
    constructor(parent, namesIn, namesOut){
        super(namesIn, namesOut)
        this.domNode = null
        this.parent = parent
        console.log('this.parent')
        console.log(this.parent)
        store[subscribe](this.createNode, 'name')
        this.createNode('k', 'o', 'n')
    }
    createNode = function(k, o, n){
        const p = document.createElement('p')
        p.append(n)
        if(this.domNode){
            this.parent.replaceChild(p, this.domNode)
        }else{
            this.parent.append(p)
        }
        this.domNode = p
    }.bind(this)
}

const p = new P(document.body, ['/name'], ['name'])
