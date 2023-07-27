const { default: mongoose } = require("mongoose");

const { Schema } = mongoose;


const PermissionSchema = new Schema({
    route: {
        type: String,
    },
    can: {
        type: String
    }
})
const Permissions = mongoose.model("Permissions", PermissionSchema);
module.exports = Permissions;
