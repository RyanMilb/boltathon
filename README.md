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

