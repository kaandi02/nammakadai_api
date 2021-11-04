const router=require('express').Router();
const Cart=require('../modals/Cart');
const {verifyToken,verifyAuth,verifyAdmin}=require('./verifyToken')


router.post("/",verifyToken,async (req,res)=>{
	const newCart=new Cart(req.body);

	try{
		const savedCart=await newCroduct.save();
		res.status(200).send(savedCroduct);
	}
	catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})


router.put('/:id',verifyAuth,async (req,res)=>{
	try{
		const updatedCart=await Cart.findByIdAndUpdate(req.params.id,{
			$set:req.body
		},{new:true});
		res.status(200).send(updatedCart)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

router.delete('/:id',verifyAuth,async (req,res)=>{
	try{
		await Cart.findByIdAndDelete(req.params.id)
		res.status(200).send("Product has been deleted!")
	}
	catch(err){
		res.status(500).send(err)
	}
})

router.get('/find/:id/:userId',verifyAuth,async (req,res)=>{
	try{
		const cart=await Cart.findOne({userId:req.params.userId})
		res.status(200).send(cart)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

router.get("/",verifyAdmin,async (req,res)=>{
	try{
		const carts=await Cart.find();
		res.status(200).send(carts)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

module.exports = router;