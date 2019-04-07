openssl ecparam -name secp256k1 -genkey -noout -out boltathon.key
openssl ec -in boltathon.key -pubout -out boltathon.cert
