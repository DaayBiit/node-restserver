const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;


let categorySchema = new Schema({
    description: {type: String, require:[true, 'La decripcion es obligatorio']},
    user: { type: Schema.Types.ObjectId, ref: 'user' }

});

categorySchema.methods.toJson = function() {
    let category = this;
    let categoryObject = category.toObject();
    delete categoryObject.password;
    return categoryObject;
}

categorySchema.plugin( uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('category', categorySchema);