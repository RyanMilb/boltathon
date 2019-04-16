class InvalidProofError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidProofError";
    }
}

module.exports = InvalidProofError;