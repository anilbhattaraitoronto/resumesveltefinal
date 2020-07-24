const express = require("express");
const router = express.Router();
const {
  //user account controllers
  signup,
  activateAccount,
  login,
  logout,
  deleteUser,
  resetPasswordRequest,
  getResetPasswordForm,
  confirmResetPassword,
  //profile controllers
  createProfile,
  getUserProfile,
  updateProfile,
  deleteProfile,
} = require(
  "../controllers/userControllers",
);

router.post("/signup", signup);
router.get("/activate/:token", activateAccount);
router.post("/login", login);
router.post("/logout", logout);

router.post("/resetpassword", resetPasswordRequest);
router.get("/delete/:email", deleteUser);
router.get("/resetpassword/:token", getResetPasswordForm);
router.post("/resetpassword/:token", confirmResetPassword);
//profile routes

router.post("/profile/create", createProfile);
router.get("/getprofile", getUserProfile);
router.post("/updateprofile", updateProfile);
router.get("/deleteprofile", deleteProfile);

module.exports = router;
