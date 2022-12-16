"use strict";

// Dependencies
const crypto = require("crypto")

// Main
class DiffieDiffie {
    load(){
        return new Promise(async(resolve)=>{
            this.server = crypto.createDiffieHellman(1000)
            this.serverPrime = this.server.getPrime()
            this.serverClient = crypto.createDiffieHellman(this.serverPrime)
            this.serverClient.generateKeys()
            this.serverClient2 = crypto.createDiffieHellman(this.serverPrime)
            this.serverClient2.generateKeys()

            resolve()
        })
    }

    getPublicKey(){
        return `${this.serverClient.getPublicKey().toString("hex")}.${this.serverPrime.toString("hex")}.${this.serverClient2.getPublicKey().toString("hex")}`
    }

    ServerGetSecret(cPublicKey){
        return new Promise(async(resolve)=>{
            const key1 = this.serverClient.computeSecret(Buffer.from(cPublicKey, "hex"))
            const key2 = this.serverClient2.computeSecret(Buffer.from(cPublicKey, "hex"))

            resolve(Buffer.from(key1.toString("ucs-2") + key2.toString("ucs-2")))
        })
    }

    clientGetSecret(client, publicKey){
        return new Promise(async(resolve)=>{
            const key1 = client.computeSecret(Buffer.from(publicKey.split(".")[0], "hex"))
            const key2 = client.computeSecret(Buffer.from(publicKey.split(".")[2], "hex"))

            resolve(Buffer.from(key1.toString("ucs-2") + key2.toString("ucs-2")))
        })
    }
}

module.exports = DiffieDiffie