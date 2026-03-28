class ApiError extends Error{
    constructor(statusCode , message = "Something went wrong" , err = []){
        super(message)
        this.statusCode = statusCode;
        this.err = err;
        this.data = null;
        this.message = message;
        this.success = false;
    }
}
export default ApiError