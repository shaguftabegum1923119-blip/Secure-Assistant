const express = require("express");
const app = express();
app.use(express.json());

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "shaguftabegum1923119@gmail.com";
const UPI = process.env.UPI || "8465014514@axl";
const WHATSAPP = process.env.WHATSAPP || "918465014514";

app.get("/", (req, res) => {
  res.json({ status: "Secure Assistant Backend Running", admin: ADMIN_EMAIL });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
