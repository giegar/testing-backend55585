import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = 'products'


const schemaProd = mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: Number,
    thumbnail: String,
    code: {
        type: String,
        unique: true
    },
    stock: Number,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, 'owner is required']
    }
})

schemaProd.plugin(mongoosePaginate)

const ProductModel = mongoose.model(collection, schemaProd)

export default ProductModel