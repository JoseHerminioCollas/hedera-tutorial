import express from "express";
import pinFileToIPFS from "./pinFileToIPFS.js";
import FormData from "form-data";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const JWT = process.env.PINATA_KEY;

((app, port) => {
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
    pinFileToIPFS(formData, JWT).then(r=>{
        res.send( r );
    });
  });

  app.listen(port, () => {
    console.log(`Aaarto application listening on port ${port}`);
  });
})(express(), 3000);
