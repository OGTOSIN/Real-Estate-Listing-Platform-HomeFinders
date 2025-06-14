const jwt = require("jsonwebtoken");
const Auth = require('../Models/authModel');

    
const validateDetails  = (req, res, next)=>{

    const {email, username, firstName, lastName, password, state} = req.body

    const errors = []

    if (!email && !username) {
        errors.push("Missing email or username")
    }

    if (!password) {
        errors.push("Please, input your password")
    }

    if(errors.length > 0) {
        return res.status(400).json({message: "Validation error", errors})
    } 

    next()

}


const auth  = async (req, res, next) => {
  
    const token = req.header("Authorization")

    if (!token) {
        return res.status(401).json({message: "Unauthorized. Please login"})
    }

    console.log({token})

    const spiltToken = token.split(" ")

    console.log({spiltToken}) 

    const accessToken = spiltToken[1]

    console.log({accessToken})

    const decoded = jwt.verify(accessToken, `${process.env.ACCESS_TOKEN}` )

    if (!decoded) {
        return res.status(401 ).json({message: "Unauthorized. Please login"})
    }

    console.log({decoded})

    const user = await Auth.findById(decoded.id)

    if (!user) {
        return res.status(404).json({message: "User not found"})
    }
 

    req.user = user

    console.log(user)

    next() 
};

const agentAuth  = async (req, res, next) => {
  
    const token = req.header("Authorization")

    if (!token) {
        return res.status(401).json({message: "Unauthorized. Please login"})
    }

    console.log({token})

    const spiltToken = token.split(" ")

    console.log({spiltToken}) 

    const accessToken = spiltToken[1]

    console.log({accessToken})

    const decoded = jwt.verify(accessToken, `${process.env.ACCESS_TOKEN}` )

    if (!decoded) {
        return res.status(401 ).json({message: "Unauthorized. Please login"})
    }

    console.log({decoded})

    const user = await Auth.findById(decoded.id)

    if (!user) {
        return res.status(404).json({message: "User not found"})
    }

    if(user.isAgent !== true) { 
        return res.status(403).json({message: "Invalid Authorization"})
    }

    req.user = user

    console.log(user)

    next() 
};

const adminAuth  = async (req, res, next) => {
  
    const token = req.header("Authorization")

    if (!token) {
        return res.status(401).json({message: "Unauthorized. Please login"})
    }

    console.log({token})

    const spiltToken = token.split(" ")

    console.log({spiltToken}) 

    const accessToken = spiltToken[1]

    console.log({accessToken})

    const decoded = jwt.verify(accessToken, `${process.env.ACCESS_TOKEN}` )

    if (!decoded) {
        return res.status(401 ).json({message: "Unauthorized. Please login"})
    }

    console.log({decoded})

    const user = await Auth.findById(decoded.id)

    if (!user) {
        return res.status(404).json({message: "User not found"})
    }

    if(user.isAdmin !== true) { 
        return res.status(403).json({message: "Invalid Authorization"})
    }

    req.user = user

    console.log(user)

    next() 
};


module.exports = {
    validateDetails,
    auth,
    agentAuth,
    adminAuth
}