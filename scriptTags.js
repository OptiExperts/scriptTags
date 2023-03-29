const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
app.set(bodyParser.urlencoded({"extended": true}));
app.use(cors());
app.use(bodyParser.json());

app.listen(3000, (token) => {
    token ? console.log("error while getting token.") : console.log("Connecting to port 3000");
})


app.get("/", (req,res) => {
    res.send({"Message": "Mini App -- Version: 1.0"});
});

// GETTING PRODUCT RESPONSE
app.post("/", async(req, res) => {
    let products = JSON.stringify(req.body);
    // console.log(products);
    fs.writeFile("./dataFile.json", products, (error) => {
        error ? console.log(error.message) : console.log("Data Inserted Successfully.");
    });
    res.send({"Message": "Data Received Successfully."});
});

app.post("/send/scriptFile", (req, res) => {
    fs.readFile("./dataFile.json", (error, data) => {
        error ? res.send("Error while fetching data..") : res.send(data);
    });
})

app.get("/miniApp.js", (req, res) => {
    res.sendFile(__dirname+"/miniApp.js");
})
