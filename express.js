import express from "express";
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
  app.get("/", (req, res) => {
    res.render('index',{hello: 'Aaarto'});
  });
  app.get("/addfile", (req, res) => {
    const formData = new FormData();
    const src = "./art.svg";
    const file = fs.createReadStream(src);
    formData.append("file", file);
    const pinataMetadata = JSON.stringify({
      name: "Goatstone",
    });
    formData.append("pinataMetadata", pinataMetadata);
    const pinataOptions = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", pinataOptions);
    pinFileToIPFS(formData, JWT).then((r) => {
      res.send(r);
    });
  });

  app.listen(port, () => {
    console.log(`Aaarto application listening on port ${port}`);
  });
})(express(), 3000);
