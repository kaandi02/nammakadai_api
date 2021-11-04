const router=require('express').Router();
const Order=require('../modals/Order');
const {verifyToken,verifyAuth,verifyAdmin}=require('./verifyToken')


router.post("/",verifyToken,async (req,res)=>{
	const newOrder=new Order(req.body);

	try{
		const savedOrder=await newOrder.save();
		res.status(200).send(savedOrder);
	}
	catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})


router.put('/:id',verifyAdmin,async (req,res)=>{
	try{
		const updatedOrder=await Order.findByIdAndUpdate(req.params.id,{
			$set:req.body
		},{new:true});
		res.status(200).send(updatedOrder)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

router.delete('/:id',verifyAdmin,async (req,res)=>{
	try{
		await Order.findByIdAndDelete(req.params.id)
		res.status(200).send("Product has been deleted!")
	}
	catch(err){
		res.status(500).send(err)
	}
})

router.get('/find/:id/:userId',verifyAuth,async (req,res)=>{
	try{
		const order=await Order.find({userId:req.params.userId})
		res.status(200).send(order)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

router.get("/",verifyAdmin,async (req,res)=>{
	try{
		const orders=await Order.find();
		res.status(200).send(orders)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

router.get("/stats",verifyAdmin,async (req,res)=>{
	const date=new Date();
	const lastMonth=new Date(date.setMonth(date.getMonth()-1));
	const previousMonth=new Date(new Date().setMonth(lastMonth.getMonth()-1));

	try{
		const income=await Order.aggregate([
			{ $match : { createdAt:{ $gte:previousMonth } } },
			{
				$project:{
					month:{ $month:"$createdAt" },
					sales:"$amount",				},
			},
			{
				$group:{
					_id:"$month",
					total:{ $sum:"$sales" }
				},
			}
		])
		res.status(200).send(income);
	}
	catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})

module.exports = router;