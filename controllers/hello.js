function getHello(req, res){
    res.status(200).send({
        "msg": "Hello world from controllers folder!!"
    });
}

// Export the function so you can use it in another file
module.exports = {
    getHello
}