import UserManager from "../dao/managers/userManagerMongo.js"
const userManager = new UserManager();

export const getUser = async (req, res) => {

    const { user } = req.user

    const result = await userManager.getUser(user._id)

    res.send(result)
}