const Roles = require("../Models/Role")

async function getRoleById(req, res, next) {
    try {
      const role = await Roles.findById(req.params.id).populate("Permissions");
      if (!role) {
        return res.status(404).json({data:{}, success: false, message: "Role not found" });
      }
      res.json({data: role, success: true, message: "Role Retrieved"});
    } catch (error) {
      next(error);
    }
  }
  
  async function updateRoleById(req, res, next) {
    try {
      const { title, Permissions } = req.body;
      const updatedRole = await Roles.findByIdAndUpdate(
        req.params.id,
        { title, Permissions },
        { new: true } 
      ).populate("Permissions");
      if (!updatedRole) {
        return res.status(404).json({data:{}, success: false, message: "Role not found" });
      }
      res.json({data: updatedRole,  success: true, message: "Role Updated"});
    } catch (error) {
      next(error);
    }
  }
  
  async function deleteRoleById(req, res, next) {
    try {
      const deletedRole = await Roles.findByIdAndRemove(req.params.id);
      if (!deletedRole) {
        return res.status(404).json({data:{}, success: false, message: "Role not found" });
      }
      res.json({data: {},  success: true, message: "Role deleted"});
    } catch (error) {
      next(error);
    }
  }

  async function getAllRoles(req, res, next) {
    try {
      const roles = await Roles.find().populate("Permissions");
      res.json({data: roles,  success: true, message: "Roles Retrieved"});
    } catch (error) {
      next(error);
    }
  }
  
  async function createRole(req, res, next) {
    try {
      const { title, Permissions } = req.body;
      const Role = await Roles.findOne({title: title});
      if(Role){
        return res.status(404).json({data:{}, success: false, message: "Role Title Already Exist" });
      }
      const newRole = new Roles({ title, Permissions });
      const savedRole = await newRole.save();
      res.status(201).json({data: savedRole,  success: true, message: "Role Created"});
    } catch (error) {
      next(error);
    }
  }

  module.exports = {
    getRoleById,
    deleteRoleById,
    updateRoleById,
    getAllRoles,
    createRole
  }