const mongoose=require("mongoose");

const ProductSchema=new mongoose.Schema(
	{
		title:{type:String,required:true},
		desc:{type:String,required:true},
		image:{type:String,required:true},
		category:{type:Array},
		color:{type:Array},
		size:{type:Array},
		price:{type:Number,required:true},
		inStock:{type:Boolean,default:true}
	},
	{timestamps:true}
)

module.exports=mongoose.model("Product",ProductSchema)