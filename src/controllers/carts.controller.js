import CartServices from "../services/carts.services.js";

// Crear nuevo carrito
export const addCart = async (req,res) =>{
    try{
        const cart = req.body
        // const addCart = await CartModel.create(cart)
        const newCart = CartServices.addCart(cart)

        return res.status(201).json({ message: "New cart created", newCart })
    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

export const getCarts = async (req,res) =>{
    try{

        const allCarts = CartServices.getCarts()

        return res.status(200).json({ message: "New cart created", allCarts })
    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// Buscar carrito por ID
export const getCartById = async (req,res) =>{
    const { cid } = req.params;

    try{
        const cart = await CartServices.getCartByID(cid)
        if (!cart) {
            return res.status(404).json({ error: `Cart ID ${cid} does not exist` })
        }

        res.status(200).json({ status: 'success', payload: cart })
    }catch(error){
        return res.status(404).json({ message: error.message })
    }
}

// Agregar productos al carrito
export const addProductCart = async (req,res) =>{
    const { pid } = req.params;
    const { cid } = req.params;

    try{
        
        await CartServices.addProductCart(cid, pid);
        res.status(200).json({ status: 'success', payload: cart })

    }catch(error){
        return res.status(500).json({ message: error.message })
    }
}

// Modificar cantidad de un producto (desde req.body)
export const updateProductCart = async (req,res) =>{
    const { cid } = req.params;
    const { pid } = req.params;
    const quantity = req.body.quantity

    try{
        const updateQuant = CartServices.updateProductCart(cid, pid, quantity);
        res.status(200).json({ status: 'success', payload: updateQuant })
    } catch{
        return res.status(500).json({ error: error.message })
    }
}

// Eliminar un producto especifico del carrito
export const deleteProductCart = async (req,res) =>{
    const { cid } = req.params;
    const { pid } = req.params;

    try{
        const deleteProd = await CartServices.deleteProductCart(cid, pid)
        res.status(200).json({ status: 'success', payload: deleteProd })
        
    }catch{
        console.log(error)
        return res.status(500).json({ error: error.message })
    }    
}

// Eliminar todos los productos del carrito
export const emptyCart = async (req,res) =>{
    const { cid } = req.params;

    try{
        const empty = await CartServices.emptyCart(cid)
        res.status(200).json({ status: "success", payload: empty })
    }catch{
        return res.status(500).json({ error: error.message })
    }
}

// Generar ticket de compra
export const purchaseProducts = async (req, res) => {
    const id = req.params.cid
    const user = req.user
    res.json({payload: user})

}