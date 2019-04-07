const { randomBytes } = require('crypto')
const secp256k1 = require('secp256k1')
const fs = require('fs');
// or require('secp256k1/elliptic')
//   if you want to use pure js implementation in node

// generate message to sign
const msg = randomBytes(32)

// generate privKey
let privKey
do {
  privKey = randomBytes(32)
} while (!secp256k1.privateKeyVerify(privKey))

fs.writeFileSync('private.key',privKey);

importedKey = fs.readFileSync('private.key')
// get the public key in a compressed format
const pubKey = secp256k1.publicKeyCreate(importedKey)

// sign the message
const sigObj = secp256k1.sign(msg, importedKey)

// verify the signature
console.log(secp256k1.verify(msg, sigObj.signature, pubKey))
// => true
