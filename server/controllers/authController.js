import userModel from '../models/userModel.js';
import { comparePassword, hashPassword } from './../helpers/authHelper.js';
import JWT from 'jsonwebtoken';

export const registerController = async(req, res) => {
    try{
        const {name,email, password, phone, address} = req.body;
        //validation
        if(!name){
            return res.send({error:'Name is required'});
        }
        if(!email){
            return res.send({error:'Email is required'});
        }
        if(!password){
            return res.send({error:'Password is required'});
        }
        if(!phone){
            return res.send({error:'Phone is required'});
        }
        if(!address){
            return res.send({error:'Address is required'});
        }
        //check user 
        const existingUser = await userModel.findOne({email})
        //existing user
        if(existingUser){
            return res.status(200).send({
                success: true,
                message: 'Already exist! Please login. '
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)
        //save
        const user = new userModel({name, email, phone, email, address, password: hashedPassword}).save();

        res.status(200).send({
            success: true,
            message: 'User registered successfully',
            user
        })

    } catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Registeration',
            error
        })
    }
};

//POST LOGIN
export const loginController = async(req,res) => {
    try{
        const {email, password} = req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        //check user 
        const user = await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'Email not registered!'
            })
        }
        const match = await comparePassword(password, user.password)
        if(!match){
            return res.status(200).send({
                success: false,
                message: 'Invalid password'
            })
        }
        //token
        const token = await JWT.sign({_id:user._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
        res.status(200).send({
            success: true,
            message: 'Login Successfully',
            user:{
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
            },
            token,
        })
    } catch(error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Login',
            error
        })
    }
};

//test controller
export const testController = (req,res) => {
    try {
        res.send("Protected route");
    } catch(error) {
        console.log(error);
        res.send({error});
        res.status(401).send({
            success: false,
            error,
            message: 'Error in admin middleware'
        })
    }
};