const e = require("express");
const express = require("express");
const fs = require("fs");

const router = express.Router();

//utility functions
const randomIndex = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

router.get("/random", (req, res) => {
  //reading json file which contains users

  fs.readFile("./users.json", (err, data) => {
    if (err) console.log(err);

    const initialData = JSON.parse(data);
    if (initialData) {
      const user = randomIndex(0, initialData.length - 1);
      res.send(initialData[user]);
    }
  });6
});

router.get("/all", (req, res) => {
  const userCount = parseInt(req.query.s);
  console.log(userCount);
  fs.readFile("./users.json", (err, data) => {
    if (err) console.log(err);
    const initialData = JSON.parse(data);
    if (!isNaN(userCount)) {
      res.send(initialData.slice(0, userCount));
      return;
    }
    if (!userCount) {
      res.send(initialData);
      return;
    }
  });
});

router.post("/save", async (req, res) => {
  const templateObject = [
    "id",
    "gender",
    "name",
    "contact",
    "address",
    "photoUrl",
  ];
  const newUser = req.body;

  if (newUser) {
    const newProperties = Object.keys(newUser);
    const eligible = true;
    for (const property of templateObject) {
      const found = newProperties.find((item) => item === property);
      if (!found) {
        res.send("Some user info is missing");
        return;
      }
    }

    if (eligible) {
      fs.readFile("./users.json", async (err, data) => {
        if (err) console.log(err);
        const previousUsers = JSON.parse(data);
        if (previousUsers) {
          const newUsers = await JSON.stringify([...previousUsers, newUser]);

          fs.writeFile("./users.json", newUsers, (err) => {
            if (err) {
              res.send("Something went wrong");
            } else {
              res.send("New user added");
            }
          });
        }
      });
    }
  }
});


router.patch("/update/:id",(req,res)=>{
    const userID = req.params.id;
    const reqData = req.body;
    const newData = Object.keys(reqData);
    console.log(newData);


    if(userID){
        fs.readFile("./users.json", async (err, data) => {
            if (err) console.log(err);
            const previousUsers = await JSON.parse(data);
            console.log(previousUsers);
            const previousData =  previousUsers.find(user => user.id == userID);
            const dataIndex = previousUsers.indexOf(previousData);

            if(previousData){
              for(const item in reqData){
                if(item !== "id"){
                  previousData[item] = reqData[item];
                }
              }
              console.log(previousData);
              previousUsers[dataIndex] = previousData;
              const finalData = JSON.stringify(previousUsers);
              console.log(finalData);
              fs.writeFile("./users.json", finalData, (err) => {
                if (err) {
                  res.send("Something went wrong");
                } else {
                  res.send("User Updated");
                }
              });
            }
          });
    }
})

module.exports = router;
