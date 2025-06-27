const express = require("express");
const multipart = require("connect-multiparty");
const userController = require("../controllers/user");

const md_auth = require("../middlewares/autenticated");
const md_upload_avatar = multipart({ uploadDir: "./uploads" });

const api = express.Router();

api.post("/register",userController.registerUser);
api.post("/login",userController.login);

api.get("/protected", [md_auth.ensureAuth], userController.protected);

api.put("/upload-avatar/:id", [md_auth.ensureAuth, md_upload_avatar], userController.uploadAvatar);

api.get("/avatar/:avatarName", userController.getAvatar);

module.exports = api;