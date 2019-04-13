class InvalidSignatureError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidSignatureError";
    }
}

module.exports = { InvalidSignatureError : InvalidSignatureError }