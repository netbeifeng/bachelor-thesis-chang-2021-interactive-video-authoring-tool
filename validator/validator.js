const Ajv = require("ajv");
const fs = require("fs");
const ajv = new Ajv();

class Validator {

    constructor() {
        this.schema = JSON.parse(fs.readFileSync('validator/schema.json'));
        this.ajvValidate = ajv.compile(this.schema);
    }
    validate(data) {
        return this.ajvValidate(data);
    };

    getErrors() {
        return this.ajvValidate.errors;
    }
    
}

module.exports = Validator;

