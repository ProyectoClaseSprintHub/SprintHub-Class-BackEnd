import {IUser, UserModel} from "../models/User"

export class UserRepository{
    async create(data: Pick<IUser, 'document'| 'email' | 'name' | 'passwordHash' | 'profilePicture'>){
        const newUser = await UserModel.create(data);
        return newUser.toObject();
    }
    async findByEmail(email:string){
        return await UserModel.findOne({ email}).lean().exec();
    }

    async findAll(){
        return await UserModel.find().select('-password').lean().exec()
    }
    async findById(id:string){
        return await UserModel.findById(id).select('-password').lean().exec();
    }
}