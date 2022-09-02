const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000;
const cors = require("cors")

//importing router
const usersRoutes = require("./routes/users.route");


//middlewares
app.use(cors());
app.use(express.json());

//using routes
app.use("/user",usersRoutes);

app.listen(PORT, () => {
  console.log(`Example app listening on PORT ${PORT}`)
})