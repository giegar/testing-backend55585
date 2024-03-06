import ProductModel from "../models/product.model.js";

class ProductManager {

    validateCode = async (code) => {

        try{ 
            const data = await ProductModel.find()
            return data.some((product) => product.code == code)
        } catch (error) {
            return error
        }
    };

    getProducts = async (limit, page, sort, category, stock) => {

        try{

            const filter = {
                ...(category && { category }),
               ...(stock && { stock })
            }
    
            const sortValues = sort === 'asc' ? {price: 1} : ('desc' ? {price: -1} : {})
    
            const options = {
                limit,
                page,
                sort: sortValues,
                lean: true
            } 

            const pageResults = await ProductModel.paginate(filter, options)

            console.log(pageResults)
            return {status: "Success",
                    payload: pageResults.docs,
                    totalPages: pageResults.totalPages,
                    prevPage: pageResults.prevPage,
                    nextPage: pageResults.nextPage,
                    page: pageResults.page,
                    limit: pageResults.limit,
                    sort: pageResults.sort,
                    prevPage: pageResults.prevPage,
                    nextPage: pageResults.nextPage,
                    hasPrevPage: pageResults.hasPrevPage,
                    hasNextPage: pageResults.hasNextPage,
                    prevLink: `http://localhost:8080/api/products/?page=${pageResults.prevPage}&&limit=${pageResults.limit}&&sort=${pageResults.sort}`,
                    nextLink: `http://localhost:8080/api/products/?page=${pageResults.nextPage}&&limit=${pageResults.limit}&&sort=${pageResults.sort}`
                }

        } catch (error) {
            return error;
        }
    };

    addProduct = async (product) => {

        try{
            
            const { title, description, price, thumbnail, code, stock } = product;

            const validate = await this.validateCode(product.code)
            if (validate) return "Code already exists";

            if(!title || !description || !price || !thumbnail || !code || !stock){
                return "Please, complete all fields";
            }

            const create = await ProductModel.create(product)
            return create;

        } catch(error) {
            return error;
        }
        
    };

    getProductById = async (id) => {

        try {
            const product = await ProductModel.findById(id)
            if(!product) return "Product not found";
            return product;

        } catch(error) {
            return error
        }
    };

    updateProduct = async (id, product) => {

        try{
            const validateID = await ProductModel.findById(id)
            if (!validateID) return "Invalid ID"

            const updatedProduct = await ProductModel.updateOne({_id: id}, {$set: product})

            const validateCod = await this.validateCode(product.code)
            if (validateCod) return "Code already exists"

            return updatedProduct;

        }catch(error){
            return error;
        }
    };

    deleteProduct = async (id) => {

        try {

            const productExists = await ProductModel.findById(id)
            if(!productExists) return "Product not found"

            const productDelete = await ProductModel.deleteOne({_id: id})

            return productDelete;

        } catch(error){
            return error;
        }
    };
}

export default ProductManager