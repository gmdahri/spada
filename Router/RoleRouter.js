const express = require("express");
const { getAllRoles, createRole, getRoleById, updateRoleById, deleteRoleById } = require("../Controller/RoleController");

const RoleRouter = express.Router();

RoleRouter.get('/', getAllRoles);
RoleRouter.post('/', createRole);
RoleRouter.get('/:id', getRoleById);
RoleRouter.put('/:id', updateRoleById);
RoleRouter.delete('/:id', deleteRoleById);


module.exports = RoleRouter;