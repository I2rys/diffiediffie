(async()=>{
    "use strict";

    // Dependencies
    const simpleAES256 = require("simple-aes-256")
    const DiffieDiffie = require("../index")
    const request = require("request-async")
    const crypto = require("crypto")
    
    // Variables
    const DifDif = new DiffieDiffie()
    
    // Main
    var publicKey = await request("http://localhost:8080/pk") // Get the server public key
    publicKey = JSON.parse(publicKey.body).data

    const client = crypto.createDiffieHellman(Buffer.from(publicKey.split(".")[1], "hex"))
    client.generateKeys()

    const secret = await DifDif.clientGetSecret(client, publicKey) // Get the secret key from the client(This)
    const encryptedData = simpleAES256.encrypt(secret, "Awesome!").toString("hex")

    // cPublicKey stands for Client Public Key
    const response = await request.post("http://localhost:8080/test", {
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify({ cPublicKey: client.getPublicKey().toString("hex"), data: encryptedData })
    })

    console.log(response.body)
})()