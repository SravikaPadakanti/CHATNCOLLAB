import userModel from '../models/user.model.js';



export const createUser = async ({
    email, password
}) => {

    if (!email || !password) {
        throw new Error('Email and password are required');
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
        email,
        password: hashedPassword
    });

    return user;

}

export const getAllUsers = async ({ userId }) => {
    const users = await userModel.find({
        _id: { $ne: userId }
    });
    return users;
}

export const getOrCreateUser = async (reqUser) => {
    if (!reqUser) return null;
    const email = (reqUser.email || '').trim().toLowerCase();
    if (!email) return null;

    let user = await userModel.findOne({ email });
    if (!user && reqUser._id) {
        user = await userModel.findById(reqUser._id);
    }
    if (!user) {
        try {
            user = await userModel.create({ email });
            console.log(`Auto-synced user account in database for: ${email}`);
        } catch (e) {
            user = await userModel.findOne({ email });
        }
    }
    return user;
};