class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
        this.stack = ''; 
        
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

export default ValidationError;
