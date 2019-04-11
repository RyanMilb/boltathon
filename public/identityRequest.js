class IdentityRequest{

    constructor(challenge,dataRequest){
        this.challenge = challenge;
        this.dataRequest = dataRequest;
    }

    sign(publicKey,privateKey,algoritm){
        this.publicKey = publicKey;
        //sign the challenge
        this.signature = crypto.subtle.sign(algoritm,privateKey,this.challenge);
    }
    
}

module.exports = IdentityRequest;