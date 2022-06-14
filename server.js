const express = require("express");

const app = express();

app.get("/", (req, res) => {
  const NodeOpenSSL = require("node-openssl-cert");
  const openssl = new NodeOpenSSL();
  const certPassword = "frame";

  const rsakeyoptions = {
    encryption: {
      password: certPassword,
      cipher: "des3",
    },
    rsa_keygen_bits: 2048,
    format: "PKCS8",
  };
  const csroptions = {
    hash: "sha512",
    days: 240,
    subject: {
      organizationName: "Frame Labs",
      organizationalUnitName: ["IT"],
      commonName: ["frame.sh", "www.frame.sh"],
      emailAddress: "support@frame.sh",
    },
  };

  // return new Promise((resolve, reject) => {
  openssl.generateRSAPrivateKey(rsakeyoptions, (err, key, cmd) => {
    if (err) {
      reject(err);
    }
    console.log(cmd);
    openssl.generateCSR(csroptions, key, certPassword, (err, csr, cmd) => {
      if (err) {
        reject(err);
      }

      csroptions.days = 240;
      openssl.selfSignCSR(
        csr,
        csroptions,
        key,
        certPassword,
        (err, crt, cmd) => {
          if (err) {
            reject(err);
          }

          console.log(cmd.command);
          console.log(crt);
          console.log(cmd.files.config);

          res.json({ cert: crt, key, certPassword });
        }
      );
    });
  });
});

//Listen port
const PORT = 8080;
app.listen(PORT);
console.log(`Running on port ${PORT}`);
