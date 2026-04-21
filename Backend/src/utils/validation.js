const validator=require("validator")

const validatesignupdata=(req)=>{
    const {username,emailId,password}=req.body;
    if(!username) throw new Error("username is required");
    if(!emailId || !validator.isEmail(emailId)) throw new Error("Enter a valid email");
    if(!validator.isStrongPassword(password)) throw new Error("Enter a strong password");
}

module.exports = validatesignupdata;