const { default: mongoose } = require("mongoose");

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
    }
})
const AuthSchemas = mongoose.model("AuthSchemas", AuthSchema);
module.exports = AuthSchemas;
