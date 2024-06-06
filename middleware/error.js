const errorHandler = (err, req, res, next) => {
    console.log(err.stack.cyan.underline);
   
    // const error = { ...err };
    // console.log("Error:", error.name.toString());
    const error = {
      name: err.name,
      message: err.message,
    };
   
    // if (err.name === "CastError") {
    //   error.message = "Энэ ID буруу бүтэцтэй ID байна!";
    //   error.statusCode = 400; // bad request
    // }
    if (
      err.name === "JsonWebTokenError" &&
      error.message === "invalid signature"
    ) {
      error.message = "Буруу токен дамжуулсан байна!";
      error.statusCode = 400;
    }
    if (err.name === "TokenExpiredError") {
      error.message = "Токен дууссан байна.";
      error.statusCode = 401;
    }
    if (err.name === "SequelizeUniqueConstraintError") {
      error.message = "Имэйл эсвэл утас бүртгэлтэй байна.";
      error.statusCode = 401;
    }
   
    // jwt malformed
   
    if (error.message === "jwt malformed") {
      error.message = "Та логин хийж байж энэ үйлдлийг хийх боломжтой...";
      error.statusCode = 401;
    }
   
    if (err.name === "JsonWebTokenError" && error.message === "invalid token") {
      error.message = "Буруу токен дамжуулсан байна!";
      error.statusCode = 400;
    }
   
    if (error.code === 11000) {
      error.message = "Энэ талбарын утгыг давхардуулж өгч болохгүй!";
      error.statusCode = 400;
    }
   
    res.status(err.statusCode || 500).json({
      success: false,
      statusCode: error.statusCode,
      error,
    });
  };
   
  module.exports = errorHandler;
   