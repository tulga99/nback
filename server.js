const express = require("express");
const dotenv = require("dotenv");
// var fs = require("fs");
var path = require("path");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const errorHandler = require("./middleware/error");
//Route оруулж ирэх
const rolesRoutes = require("./routes/role");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

//app iin tohirgoog process.env ruu achaallah
dotenv.config({ path: ".env" });

// const db = require("./config/db-postgres");

const app = express();

// Манай рест апиг дуудах эрхтэй сайтуудын жагсаалт :
var whitelist = [
  "http://localhost:5600",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://apps.erdenetmc.mn/dhl/",
];

// Өөр домэйн дээр байрлах клиент вэб аппуудаас шаардах шаардлагуудыг энд тодорхойлно
var corsOptions = {
  // Ямар ямар домэйнээс манай рест апиг дуудаж болохыг заана
  origin: function (origin, callback) {
    console.log("==>", origin);
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      // Энэ домэйнээс манай рест рүү хандахыг зөвшөөрнө
      callback(null, true);
    } else {
      // Энэ домэйнд хандахыг хориглоно.
      callback(new Error("Horigloj baina.."));
    }
  },
  // Клиент талаас эдгээр http header-үүдийг бичиж илгээхийг зөвшөөрнө
  allowedHeaders: "Authorization, Set-Cookie, Content-Type",
  // Клиент талаас эдгээр мэссэжүүдийг илгээхийг зөвөөрнө
  methods: "GET, POST, PUT, DELETE",
  // Клиент тал authorization юмуу cookie мэдээллүүдээ илгээхийг зөвшөөрнө
  credentials: true,
};

const limitter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: "15 минутанд 3 удаа л хандаж болно! ",
});

app.use(limitter);
// index.html ийг public  хавтас дотроос ол гэсэн тохиргоо

app.use(express.json()); // request Боди доторх мэдээллийг ингэж
// Өөр өөр домэйнтэй вэб аппуудад хандах боломж өгнө
app.use(cors(corsOptions));
// Сэрвэр рүү upload хийсэн файлтай ажиллана

app.use("/api/v1/roles", rolesRoutes);

// db.sequelize
//   .sync()
//   .then((result) => {
//     console.log("sync hiigdlee...");
//   })
//   .catch((err) => console.log(err));

prisma
  .$connect()
  .then(async () => {
    console.log("Connected to the database");
    await prisma.$disconnect(); // Close the database connection when done
  })
  .catch(async (err) => {
    console.error("Error connecting to the database:", err);
    await prisma.$disconnect(); // Close the database connection when done
  })
  .finally(async () => {
    console.log("connection disconnect");
    await prisma.$disconnect(); // Close the database connection when done
  });

const server = app.listen(
  process.env.PORT,
  console.log(`Express сервер ${process.env.PORT} порт дээр аслаа... `)
);

// Баригдалгүй цацагдсан бүх алдаануудыг энд барьж авна
process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});
