const router=require('express').Router();
const User=require('../modals/User');
const CryptoJs=require('crypto-js');
const jwt=require('jsonwebtoken');

//Register
router.post("/register",async (req,res)=>{
	const newUser=new User({
		username:req.body.username,
		email:req.body.email,
		password:CryptoJs.AES.encrypt(req.body.password,process.env.PASSHASH).toString()
	});
	try{
		const savedUser=await newUser.save();
		res.json(savedUser).status(200);
	}catch(err){
		res.json(err).status(500);
	}
})

//Login
router.post("/login",async (req,res)=>{
	try{
		const user=await User.findOne({username:req.body.username})
		if(!user){
			res.status(401).json("Wrong Credentials!");
		}
		else{
			const hashedPass=CryptoJs.AES.decrypt(user.password,process.env.PASSHASH);
			const OriginalPassword=hashedPass.toString(CryptoJs.enc.Utf8);

			if(OriginalPassword!=req.body.password){
				res.status(401).send("Invalid Password");
			}
			else{
				const accessToken=jwt.sign({
					id:user._id,
					isAdmin:user.isAdmin
				},
				process.env.JWT_KEY,
				{expiresIn:"7d"}
				)
				const {password,...others}=user._doc
				res.status(200).send({...others,accessToken})
			}
		}
	}
	catch(err){
		res.status(400).send(err)
		console.log(err)
	}
})

module.exports = router;