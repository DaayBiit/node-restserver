const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let roleValidate = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido'
};

let userSchema = new Schema({
    name: {
        type: String,
        require:[true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'El correo es obligatoria']
    },
    password: {
        type: String,
        require: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: roleValidate
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.toJson = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

userSchema.plugin( uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('user', userSchema);