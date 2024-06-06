const express = require("express");

const {
  getRoles,
  postRole,
} = require("../controller/role");
const router = express.Router({ mergeParams: true });

router.route("/info/:id").post(postRole);
router.route("/g").get(getRoles);

module.exports = router;
