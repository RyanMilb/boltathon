# boltathon

# Lightning Credentials

A prototype Decentralised Identity Document (DID) using the lightning network.  A DID is a credential
that can be used to verify identity that is countersigned by a third party issuer.

# Project goal:

   Social experience / goal to allow oauth type authentication without accessing third party systems
   that may be used to track online usage.
   Will also allow decentralised storage of credentials to mitigate mass identity theft.

# Infrastructure:
lnd nodes at: 157.230.110.159

- owner: The owner of the credential
- issuer: The issuer is the entity that verifies the owner.  This may be some kind of KYC check.
- verifyer: An entity that uses the credental to authorise access to a service.

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
