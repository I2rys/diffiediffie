(async()=>{
    "use strict";

    // Dependencies
    const simpleAES256 = require("simple-aes-256")
    const bodyParser = require("body-parser")
    const DiffieDiffie = require("../index")
    const express = require("express")
    
    // Variables
    const web = express()
    const port = process.env.PORT || 8080
    
    const DifDif = new DiffieDiffie()
    
    /// Configurations
    // Express
    web.use(bodyParser.json({ limit: "50mb" }))

    // Main
    await DifDif.load() // Load the stuff
    
    web.get("/pk", (req, res)=>{
        res.json({
            status: "success",
            data: DifDif.getPublicKey() // Get DiffieDiffie public key
        })
    })

    web.post("/test", async(req, res)=>{
        const secret = await DifDif.ServerGetSecret(req.body.cPublicKey) // Get the secret key from the server(This)
        const decryptedData = simpleAES256.decrypt(secret, Buffer.from(req.body.data, "hex")).toString()

        res.send(decryptedData)
    })
    
    web.listen(port, ()=>console.log(`Website is running. Port: ${port}`))
})()