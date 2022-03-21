// server.js
console.log("May Node be with you")

const express = require('express');
const bodyParser = require('body-parser')
const { sendFile } = require('express/lib/response');
const res = require('express/lib/response');
const { LEGAL_TCP_SOCKET_OPTIONS } = require('mongodb');
const app = express();
const MongoClient = require('mongodb').MongoClient

MongoClient.connect("mongodb+srv://dr3adnought:T%40yl0rR3n3%21@cluster0.fh7fa.mongodb.net/Star_Wars_Quotes?retryWrites=true&w=majority", {
    useUnifiedTopology: true})
    .then(client => {
        console.log("Connected to Database")
        const db = client.db("Star_Wars_Quotes")
        const quotesCollection = db.collection("quotes")
        
        
        
        // Make sure you place body-parser before your CRUD handlers!
        app.set("view engine", "ejs")
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(express.static("public"))
        app.use(bodyParser.json())
        
        // LISTEN to the port for input
        app.listen(3000, function() {
            console.log("listening on 3000")
        })
        
        // GET index.html
        app.get('/', (req, res) => {
            // res.sendFile(__dirname + '/index.html')
            db.collection("quotes").find().toArray()
                .then(results => {
                res.render("index.ejs", { quotes: results });
                })
                .catch((error) => console.error(error));
        });
        
        // POST to quotes
        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                   res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put("/quotes", (req, res)=> {
            quotesCollection.findOneAndUpdate(
                {name: 'Yoda' },
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                {
                    upsert: true
                }
            )
            .then(result => {
                res.json("Success")
            })
            .catch(error => console.error(error))
        })
        
        app.delete("/quotes", (req, res) => {
            quotesCollection.deleteOne(
                { name: req.body.name },
            )
            .then(result => {
                if (result.deletedCount === 0) {
                    return res.json("No quote to delete")
                }
                res.json("Deleted Darth Vadar's Quote")
            })
            .catch(error => console.error(error))
        })  

    })
    .catch(error => console.error(error))
    