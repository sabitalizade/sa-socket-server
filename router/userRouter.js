import express from "express"
import Users from '../model/Users.js'
import bcrypt from 'bcryptjs'
import {registerValidation,loginValidation} from '../validation.js'

const router =express.Router();



router.post("/register" , async (req,res)=>{
const {error}=registerValidation(req.body);
// Validation
 if (error) {
     res.status(400).send(error.details[0].message)
 }else{
     const existEmail = await Users.findOne({email:req.body.email});
     if(existEmail) return res.status(400).send("Email artiq mövcuddur!")
     
        const salt=await bcrypt.genSalt(10);
        const bcryptedPassword=await bcrypt.hash(req.body.password,salt)
         const user  = new Users({
             username:req.body.username,
             email:req.body.email,
             password:bcryptedPassword
         })
         try {
             const savedUser=await user.save()
             res.send(savedUser)
            //  res.status(200).send({id:savedUser._id,username:savedUser.username,email:savedUser.email})
         } catch (error) {
             res.status(400).send(error)
         }
     
 }
})

router.post("/login", async(req,res)=>{
    const {error}=loginValidation(req.body);
// Validation
 if (error) return res.status(400).send(error.details[0].message)
 
    const user = await Users.findOne({email:req.body.email});

    if(!user) return res.status(400).send("E-mail yanlişdir")
    
    const validPass=await bcrypt.compare(req.body.password,user.password);

    if(!validPass) return res.status(400).send("Şifre yanlişdir")
     
    res.send(user)
    // res.send({id:user._id,username:user.username,email:user.email})
    

})



export default router