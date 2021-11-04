const jwt=require('jsonwebtoken')

const verifyToken=(req,res,next)=>{
	const authHeader=req.headers.token
	if(authHeader){
		const token=authHeader.split(" ")[1]
		jwt.verify(token,process.env.JWT_KEY,(err,user)=>{
			if(err){
				return res.status(401).send("Token is not valid!");
			}
			else{
				req.user=user
				next();
			}
		})
	}
	else{
		return res.status(401).send("Login First");
	}
}

const verifyAuth=(req,res,next)=>{
	verifyToken(req,res,()=>{
		if(req.user.id===req.params.id || req.user.isAdmin){
			next();
		}
		else{
			res.status(403).send("Method Not Allowed")
		}
	})
}

const verifyAdmin=(req,res,next)=>{
	verifyToken(req,res,()=>{
		if(req.user.isAdmin){
			next();
		}
		else{
			res.status(403).send("Method Not Allowed")
		}
	})
}

module.exports={verifyToken,verifyAuth,verifyAdmin}