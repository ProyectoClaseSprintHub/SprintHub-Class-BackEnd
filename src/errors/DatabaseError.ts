class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
        this.stack = ''; 
        
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}

export default DatabaseError;
