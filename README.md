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

# Sample credential
```did:ln:02cd3967dcef276d329156530a333c0292b43eacd8d229d1d9637a699e12d514e9```

The DID subject is comprised of:
* ```did``` : Subject
* ```ln``` : Method
* ```02cd3967dcef276d329156530a333c0292b43eacd8d229d1d9637a699e12d514e9``` : node public key (specific-idstring)

## A Simple DID document

```
{
  "@context": "https://w3id.org/did/v1",
  "id": "did:ln:<ownner public key",
  "channelId":523226:1367:0
  
  "authentication": [{
    // this key can be used to authenticate as did:...fghi
    "id": "did:ln:<owner public key>#keys-1",
    "type": "RsaVerificationKey2018",
    "controller": "did:ln:<owner public key>",
    "publicKeyPem": "-----BEGIN PUBLIC KEY...END PUBLIC KEY-----\r\n"
  }],
  
  "proof": {
    "type": "LinkedDataSignature2015",
    "created": "2019-04-05T09:02:20Z",
    "creator": "did:ln:<issuer public key>#keys-1",
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

