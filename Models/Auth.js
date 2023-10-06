const { default: mongoose, mongo } = require("mongoose");

const { Schema } = mongoose;


const AuthSchema = new Schema({
    Username: {
        type: String,
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: mongoose.Schema.ObjectId,
        ref: "Roles"
    },
    googleId:{
        type: String,
    },
    facebookId:{
        type: String,
    },
    quizzes:[
        {type: mongoose.Types.ObjectId, ref: "Quiz"}
    ]
})
const AuthSchemas = mongoose.model("AuthSchemas", AuthSchema);
module.exports = AuthSchemas;
