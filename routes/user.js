const router=require('express').Router();
const User=require('../modals/User');
const {verifyToken,verifyAuth,verifyAdmin}=require('./verifyToken')


router.put('/:id',verifyAuth,async (req,res)=>{
	if(req.body.password)
		req.body.password=CryptoJs.AES.encrypt(req.body.password,process.env.PASSHASH).toString()
	else{
		try{
			const updatedUser=await User.findByIdAndUpdate(req.params.id,{
				$set:req.body
			},{new:true});
			res.status(200).send(updatedUser)
		}
		catch(err){
			console.log(err);
			res.status(500).send(err)
		}
	}
})

router.delete('/:id',verifyAuth,async (req,res)=>{
	try{
		await User.findByIdAndDelete(req.params.id)
		res.status(200).send("User has been deleted!")
	}
	catch(err){
		res.status(500).send(err)
	}
})

router.get('/find/:id',verifyAdmin,async (req,res)=>{
	try{
		const user=await User.findById(req.params.id)
		const {password,...others}=user._doc
		res.status(200).send(others)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

router.get('/',verifyAdmin,async (req,res)=>{
	try{
		const users=await User.find()
		res.status(200).send(users)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

router.get('/stats',verifyAdmin,async (req,res)=>{

	const date=new Date();
	const lastYear=new Date(date.setFullYear(date.getFullYear()-1));

	try{
		const data=await User.aggregate([
			{ $match : { createdAt:{ $gte:lastYear } } },
			{
				$project:{
					month:{ $month:"$createdAt" },
				},
			},
			{
				$group:{
					_id:"$month",
					total:{ $sum:1 }
				},
			}
		])
		res.status(200).send(data);
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

module.exports = router;