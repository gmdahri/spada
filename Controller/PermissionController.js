const express = require("express");
const Permissions = require("../Models/Permissions"); 

async function getAllPermissions(req, res, next) {
    try {
      const permissions = await Permissions.find();
      res.json({success: true, message: "Permission Retrieved", data: permissions});
    } catch (error) {
      next(error);
    }
  }
  
  async function createPermission(req, res, next) {
    try {
      const { route, can } = req.body;
      const Permission = await Permissions.findOne({route, can });
      console.log('permission', Permission)
      if(Permission){
        return res.status(404).json({data:{}, success: false, message: "Permission Already Exist" });
      }
      const newPermission = new Permissions({ route, can });
      const savedPermission = await newPermission.save();
      res.status(201).json({success: true, message: "Permission Created", data: savedPermission});
    } catch (error) {
      next(error);
    }
  }
  
  async function getPermissionById(req, res, next) {
    try {
      const permission = await Permissions.findById(req.params.id);
      if (!permission) {
        return res.status(404).json({success: false, data: {}, message: "Permission not found" });
      }
      res.json({success: true, message: "Permission Created", data: permission});
    } catch (error) {
      next(error);
    }
  }
  
  async function updatePermissionById(req, res, next) {
    try {
      const { route, can } = req.body;
      const updatedPermission = await Permissions.findByIdAndUpdate(
        req.params.id,
        { route, can },
        { new: true } 
      );
      if (!updatedPermission) {
        return res.status(404).json({data:{}, success: false, message: "Permission not found" });
      }
      res.json({success: true, message: "Permission Updated", data: updatedPermission});
    } catch (error) {
      next(error);
    }
  }
  
  async function deletePermissionById(req, res, next) {
    try {
      const deletedPermission = await Permissions.findByIdAndRemove(req.params.id);
      if (!deletedPermission) {
        return res.status(404).json({ success: true, data: {},message: "Permission not found" });
      }
      res.json({success: true, message: "Permission Deleted", data: {}});
    } catch (error) {
      next(error);
    }
  }

module.exports = {
    createPermission,
    deletePermissionById,
    updatePermissionById,
    getAllPermissions,
    getPermissionById
};
