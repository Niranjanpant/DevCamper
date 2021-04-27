class ErrorResponse extends Error {
  //constructor runs when we instantiate an object from the class
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;
