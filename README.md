# boltathon

# Lightning Credentials

A prototype Decentralised Identity Document (DID) using the lightning network.  A DID is a credential
that can be used to verify identity that is countersigned by a third party issuer.

# Project goal:

   Social experience / goal to allow oauth type authentication without accessing third party systems
   that may be used to track online usage.
   Will also allow decentralised storage of credentials to mitigate mass identity theft.

# Infrastructure:

- 157.230.110.159 : owner: The owner of the credential
- 139.59.213.116 : issuer: The issuer is the entity that verifies the owner.  This may be some kind of KYC check.
- 139.59.213.150 : verifyer: An entity that uses the credental to authorise access to a service.

- credential: A document that can be provided as a proof which may be countersigned by a third party

# Sample Decentralised IDentifier (DID)
```did:ln:02cd3967dcef276d329156530a333c0292b43eacd8d229d1d9637a699e12d514e9```

The DID subject is comprised of:
* ```did``` : Subject
* ```ln``` : Method
* ```02cd3967dcef276d329156530a333c0292b43eacd8d229d1d9637a699e12d514e9``` : node public key (specific-idstring)

We would like to have used the blockstack DID spec for this but would need to share the private key between blockstack and lnd which isn't possible at the moment.


## A Simple DID document object (DDO)
This has been based on extending the existing blockstack.id standard

```
// this section is extracted from the blockstack api call /////////////////////////////////////////////
// https://core.blockstack.org/v1/dids/did:stack:v1:12ZSnaEQMFT33itUonYTbkgYQ9AGwbe73c-0
// where the did is formed from the blockstack id
// in the zonefile section of https://registrar.blockstack.org/v1/names/runcrypto.id.blockstack


{
  "@context": "https://w3id.org/did/v1",
  "id": "did:stack:v1:12ZSnaEQMFT33itUonYTbkgYQ9AGwbe73c-0",
  "channelId":523226:1367:0
  
   "publicKey": [
            {
                "id": "did:stack:v1:12ZSnaEQMFT33itUonYTbkgYQ9AGwbe73c-0#keys-1",
                //this is the blockstack public key
                "publicKeyHex": "022af593b4449b37899b34244448726aa30e9de13c518f6184a29df40823d82840",
                "type": "secp256k1"
            },
            
            
// these keys have been added and relate to the boltathon project ////////////////////////////////////


            {
            
                //this is the lnd public key used for signing messages
                "id": "did:stack:v1:12ZSnaEQMFT33itUonYTbkgYQ9AGwbe73c-0#keys-2",
                "publicKeyHex": "03319c0de22d1e9f2b29259bbb65a92038f474e5d5af58856d47fc71fd89c7ed1c",
                "type": "secp256k1"
            },
            {
                //this is the c-lightning public key used for creating the channel
                "id": "did:stack:v1:12ZSnaEQMFT33itUonYTbkgYQ9AGwbe73c-0#keys-3",
                "publicKeyHex": "022af593b4449b37899b34244448726aa30e9de13c518f6184a29df40823d82840",
                "type": "secp256k1"
            },
            {
                //this is added by the issuer of the credential
                "id": "lightning_club_did_that_we_dont_have#keys-1",
                "publicKeyHex": "031abec42b0df2b5e1044cf55a9294d786ba581ccc1b751af9a7ea63c1a89cf654",
                "type": "secp256k1"
            }
            
   //////////////////////////////////////////////////////////////////////////////////////////////////////
   
  ],
  
  // We also add the authentication section to tell us which of the public keys to use to verify identity in 
  // verify the owner of the credential section of the walkthrough
  
  "authentication": [
           {"did:stack:v1:12ZSnaEQMFT33itUonYTbkgYQ9AGwbe73c-0#keys-2"}
  ],
  
  // Adding the channelId here as it seems like the only plausable place for it to go
  
  "service": [{
    "id": "did:stack:v1:12ZSnaEQMFT33itUonYTbkgYQ9AGwbe73c-0;channelId",
    "type": "LightningNetworkChannel.0Service",
    "shortChannelId": "1487922x68x1",
    "serviceEndpoint": "https://1ml.com/"
  }],
  
  // This section is added by the credential issuer after the owner has supplied it to them for signing
  "proof": {
    "type": "LinkedDataSignature2015",
    "created": "2019-04-05T09:02:20Z",
    //should really have another did here of the signer
    "creator": "lightning_club_did_that_we_dont_have#keys-1",
    "signatureValue": "<document signature goes here>"
  }
}
```

# Walkthrough
## creation
1. owner generates credential from form
2. owner opens channel with issuer
3. owner adds channelId to credential
4. owner provides issuer with credential
5. issuer performs KYC and signs the credential
6. issuer provides owner with signed credential

## verification
1. verifying node gets the DID document from provider
### verify the owner of the credential
2. verifying node challenges provider of document to prove they are the subject (id) in the document : "987638276 sign this message"
3. provider signs challenge using lnd signmessage
4. verifying node checks challenge response using lnd verifymessage
### verify the contents of the credential
5. verifying node checks document 'proof' attribute using lnd verifymessage
### verify the revokable status of the credential
6. verifying node checks that the channel is still active

# API
## Issuer
getCredential - Accepts an unverified credential, confirms that 'id' supplied by the provider currently has a channel open with the issuer.  Located in boltathon/issuerServer.js
Test api with this, requires credential in json file.
```
curl -vX POST 157.230.110.159:3001/getCredential -d @tempExampleTemplate.json --header "Content-Type: application/json"
```

