const mongoose=require("mongoose");
const validator=require("validator");

const UserSchema= new mongoose.Schema({
    username:{
        type:String,
        minLength:2,
        maxLength:20,
        required:true,
    },
    emailId:{
        type:String,
        required:true,
        lowercase:true,
        validate: [validator.isEmail,"Enter a valid email"],
        unique:true
    },
    gender:{
        type:String,
        lowercase:true,
        enum:{
            values:["male","female","oter"],
            message:"Gender must be male, female or other",
        },
    },
    age:{
        type:Number,
    },
    about:{
        type:String,
        maxLength:2000,
        default:"This is default of user",
    },
    skills:{
        type:[String],
        default:[],
        validate:{
            validator :function(value) {
                return value.length<=10 && new Set(value).size==value.length;
            },
            message: "skills must be unique and at most 10",
        },
    },
    password:{
        type:String,
        require:true,
        validate:[validator.isStrongPassword,"Password must me strong"],
    },
    photourl:{
        type:String,
        trim:true,
        validate:[validator.isURL,"Enter a valid photo URL"],
        default:"https://i.pinimg.com/280x280_RS/cf/ae/0e/cfae0e4f2dba0629d6c46aff2426f481.jpg",
    },
},{timestamps:true});

const User = mongoose.model("User",UserSchema);

module.exports= User;