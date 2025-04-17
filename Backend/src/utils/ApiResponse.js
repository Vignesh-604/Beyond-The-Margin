class ApiResponse {
    constructor(
        statusCode,
        data,
        message
    ) {
        this.statusCode = statusCode        // HTTP status code provided to the constructor.
        this.data = data                    // data provided to the constructor
        this.message = message
        this.success = statusCode < 400     // If status code is less than 400 then success
    }
}

export { ApiResponse }