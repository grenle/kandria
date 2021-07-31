//@ts-check

const isKandriaProxy = Symbol('kandria/proxy')
const subscribe = Symbol('kandria/subscribe')

function safePush(k, v, obj){
    if(!obj[k]){
        obj[k] = [v]
    }
    else{
        obj[k].push(v)
    }
}

function wrap(candy){
    const subscribers = {}
    candy[subscribe] = (func, key) => safePush(key, func, subscribers)
    candy[isKandriaProxy] = true
    return new Proxy(candy, {
        set: function(target, key, newValue, receiver){
            const oldValue = Reflect.get(target, key, receiver)
            const x = Reflect.set(target, key, newValue, receiver)
            const functions = subscribers[key]
            if(functions){
                functions.forEach( f => f(key, oldValue, newValue) )
            }
            return x
        }
    })
}

function makeStore(initialValues={}){
    const res = {}
    for(const key in initialValues){
        const value = initialValues[key]
        if(typeof value === 'object'){
            res[key] = wrap(makeStore(value))
        }
        else{
            res[key] = value
        }
    }
    return wrap(res)
}

const testVector = {
    counter: 0,
    a: 'a',
    b: {
        ba: 'ba'
    },
    c: {
        ca: {
            caa: 'caa'
        }
    }
}

export { makeStore, subscribe }

// dump in test
//const store = makeStore(testVector)
//store.c.ca[subscribe]((o, n) => console.log(`lurking from ${o} to ${n}`),'caa')
//store.c.ca.caa = 'new caa'
//store.c.ca[subscribe]((o, n) => console.log(`watching from ${o} to ${n}`),'cab')
//store.c.ca.cab = 'lol'
//store.c.ca[subscribe]((o, n) => console.log(`watching from ${o} to ${n}`))
//store.c.ca.caa = 'newer caa'
//store.c.ca.cbb = 'somethin\' else'
