const express = require("express");
const { getAllPermissions, createPermission, getPermissionById, updatePermissionById, deletePermissionById } = require("../Controller/PermissionController");

const PermissionRouter = express.Router();

PermissionRouter.get('/', getAllPermissions);
PermissionRouter.post('/', createPermission);
PermissionRouter.get('/:id', getPermissionById);
PermissionRouter.put('/:id', updatePermissionById);
PermissionRouter.delete('/:id', deletePermissionById);

module.exports = PermissionRouter;