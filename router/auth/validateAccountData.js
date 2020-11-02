module.exports = (req, res, next) => {
    const {body} = req;

    if(!body.name || !body.password){
        res.status(400).json({message: "Please provide a name and password"})
    }
    else {
        next()
    }
};
