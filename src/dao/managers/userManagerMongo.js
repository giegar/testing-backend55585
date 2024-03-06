import UserModel from "../models/users.model.js"

class UserManager {

    getUser = async (id) => {
    
    const user = await UserModel.findOne({_id: id})
    return user

    }

}

export default UserManager

