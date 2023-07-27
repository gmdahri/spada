const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;


const RoleSchema = new Schema({
    title: {
        type: String,
        require: true,
        unique: true
    },
    Permissions: [{
        type: mongoose.Types.ObjectId,
        ref: 'Permissions'
    }]

})
const Roles = mongoose.model("Roles", RoleSchema);
module.exports = Roles;
