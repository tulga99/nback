const path = require("path");

const MyError = require("../utils/myErrors");
const asyncHandler = require("../middleware/asyncHandler");
const { PrismaClient } = require("@prisma/client");

// const User = require("../models/User");
const prisma = new PrismaClient();

exports.getRoles = asyncHandler(async (req, res, next) => {
  console.log("console.log", req.body, req.params);

  const posts = await prisma.eventRegister.findMany();
  await prisma.$disconnect();

  res.status(200).json({
    success: true,
    data: posts,
  });
});

exports.postRole = asyncHandler(async (req, res, next) => {
  console.log("console.log", req.params);

  const posts = await prisma.eventRegister.update({
    where: {
      phone: req.params.id,
    },
    data: {
      value: "1",
    },
  });
  await prisma.$disconnect();

  if(!posts){
    res.status(200).json({
      success: false,
      data: posts,
    });
  }

  res.status(200).json({
    success: true,
    data: posts,
  });
});
