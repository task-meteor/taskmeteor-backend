module.exports = (req, res, next) => {
    const {body} = req;

    if(!body.email || !body.password){
        res.status(400).json({message: "Please provide a email and password"})
    }
    else {
        next()
    }
};
