import mongoose, { SchemaTypes } from "mongoose";

const collection = 'users'

const schemaUsers = mongoose.Schema({
    name: {type: String, required: [true, 'name is required']},
    lastname: {type: String, required: [true, 'lastname is required']},
    age: Number,
    email: {type: String, unique: true, required: [true, 'email is required']},
    password: {type: String, required: [true, 'password is required']},
    rol: {type: String, default: 'user', enum: ['user', 'admin', 'premium']},
    cartId: {type:SchemaTypes.ObjectId, ref:'Cart'}
})

mongoose.models = {}
const UserModel = mongoose.model(collection, schemaUsers)

export default UserModel