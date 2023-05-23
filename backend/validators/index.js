const { body, validationResult } = require('express-validator');

function emailValidation(){
    return {
        email: {
            errorMessage: "Email incorrecto",
            notEmpty: true,
            trim: true,
            isEmail: true,
        },
    };
}

function passwordValidation(){
    return {
        password:{
            notEmpty: true,
            trim: true,
            isLength: {
                options: {
                    min: 8,
                    max: 72
                },
            },
        },
    };
}

function notEmptyValidator(...fields){
    const validation = {};
    fields.forEach(field => {
        validation[field] = {
            notEmpty: true,
        };
    });
    return validation;
}

function loginValidator(){
    return {
        ...emailValidation(),
        ...passwordValidation()
    };
}


module.exports = {
    emailValidation,
    loginValidator,
    notEmptyValidator,
};