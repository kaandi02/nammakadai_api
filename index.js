const express=require('express');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const cors=require('cors');

const userRoutes=require('./routes/user');
const authRoutes=require('./routes/auth');
const productRoutes=require('./routes/product');
const cartRoutes=require('./routes/cart');
const orderRoutes=require('./routes/order');
const paymentRoutes=require('./routes/stripe');

const app=express();
app.use(cors());
dotenv.config();

mongoose.connect(
	process.env.DB_URL
	).then(()=>{
		console.log("DB Connected!")
	}).catch((err)=>{
		console.log(err)
	})

app.use(express.json());

app.use("/api/user",userRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/checkout",paymentRoutes);

app.listen(process.env.PORT||5000)