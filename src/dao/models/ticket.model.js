import mongoose, { SchemaTypes } from "mongoose";

const collection = 'ticket'

const schemaTicket = mongoose.Schema({
    code: {
        type: String,
        unique: true
    },
    purchase_datetime: {
        type:Date,
        default: Date.toString
    },
    amount: Number,
    purchaser: String,
    products: {
        type: [
            {
                _id: false,
                product: { 
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: Number,
            },
        ],
        default: [],
    }
})

schemaTicket.pre('findOne', function() {
    this.populate('products.product')
})

const TicketModel = mongoose.model(collection, schemaTicket)

export default TicketModel