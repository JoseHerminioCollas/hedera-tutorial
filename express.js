import express from "express";
import bodyParser from 'body-parser'
import pinFileToIPFS from "./pinFileToIPFS.js";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const JWT = process.env.PINATA_KEY;

/**
A server to support the upload of an SVG file
save the file to IPFS
record the file as an NFT on Hedera
*/
((app, port) => {
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({extended:true}))
  app.use(bodyParser.json())

  app.get("/", (req, res) => {
    res.render('index',{hello: 'Aaarto'});
  });
  app.post("/addfile", (req, res) => {
    const {art} = req.body;
    const formData = new FormData();
    formData.append("file", Buffer.from(art), 'aaarto.svg');
    const pinataMetadata = JSON.stringify({
      name: "Aaarto",
    });
    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    pinFileToIPFS(formData, JWT).then((r) => {
      res.send(r);
    });
    console.log('Aaarto post')
  });

  app.listen(port, () => {
    console.log(`Aaarto application listening on port ${port}`);
  });
})(express(), 3000);
