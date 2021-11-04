const router=require('express').Router();
const stripe=require('stripe')('sk_test_51JrQUiSH4rFfOIzNxOeAzZc65ODRrEa3rXPiXj2gSYofU2TBVf7KwDSYZCotUKjFVuJWGzy3B2revzkxnT3CyvYI00PSNRLwOC')

router.post('/payment',(req,res)=>{
	stripe.charges.create({
		source:req.body.tokenId,
		amount:req.body.amount,
		currency:"inr",
	},(stripeErr,stripeRes)=>{
		if(stripeErr){
			console.log(stripeErr)
			res.status(500).send(stripeErr)
		}
		else
			res.status(200).send(stripeRes)
	})
})
/*router.get('/payment',(req,res)=>{
	res.status(200).send(process.env.STR_KEY)
})*/

module.exports = router;