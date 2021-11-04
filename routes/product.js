const router=require('express').Router();
const Product=require('../modals/Product');
const {verifyToken,verifyAuth,verifyAdmin}=require('./verifyToken')


router.post("/",verifyAuth,async (req,res)=>{
	const newProduct=new Product(req.body);

	try{
		const savedProduct=await newProduct.save();
		res.status(200).send(savedProduct);
	}
	catch(err){
		console.log(err)
		res.status(500).send(err)
	}
})


router.put('/:id',verifyAuth,async (req,res)=>{
	try{
		const updatedProduct=await Product.findByIdAndUpdate(req.params.id,{
			$set:req.body
		},{new:true});
		res.status(200).send(updatedProduct)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

router.delete('/:id',verifyAuth,async (req,res)=>{
	try{
		await Product.findByIdAndDelete(req.params.id)
		res.status(200).send("Product has been deleted!")
	}
	catch(err){
		res.status(500).send(err)
	}
})

router.get('/find/:id',async (req,res)=>{
	try{
		const product=await Product.findById(req.params.id)
		res.status(200).send(product)
	}
	catch(err){
		console.log(err);
		res.status(500).send(err)
	}
})

router.get('/',async (req,res)=>{
	try{
		const qNew=req.query.new
		const qCategory=req.query.category

		let products;

		if(qNew){
			products=await Product.find().sort({createdAt:-1}).limit(1);
		}
		else if(qCategory){
			products=await Product.find({category:{
				$in:[qCategory]
			}})
		}
		else{
			products=await Product.find();
		}
		res.status(200).send(products)
	}
	catch(err){
		res.status(500).send(err);
	}
})
module.exports = router;