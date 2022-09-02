const e = require("express");
const express = require("express");
const fs = require("fs");

const router = express.Router();

//utility functions
const randomIndex = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;


  /* 
  this get endpoint provides us with a random user each time.
  
  */

  
router.get("/random", (req, res) => {
  //reading json file which contains users

  fs.readFile("./users.json", (err, data) => {
    if (err) console.log(err);

    const initialData = JSON.parse(data);
    if (initialData) {
      const user = randomIndex(0, initialData.length - 1);
      res.send(initialData[user]);
    }
  });
  6;
});


/*  
this get user/all endponit provides us list of all users and while this endpoint is hit with a query parameter (s) with a number define it limits the count of user and provides us a number of user according the number provided as query parameter
*/

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


/*
THis post endpoint stores data in users.json file,to do so we need to provide this with some required info about a user we want to save without proper information it will decline our saving request.
*/
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

/*
This patch end point facilites us updating an user's information on basis of user id it perfoms and query and determines where a change needed to be happen and preform accordingly and all is patched according to the request body(object provided)
*/

router.patch("/update/:id", (req, res) => {
  const userID = req.params.id;
  const reqData = req.body;
  const newData = Object.keys(reqData);
  console.log(newData);

  if (userID) {
    fs.readFile("./users.json", async (err, data) => {
      if (err) console.log(err);
      const previousUsers = await JSON.parse(data);
      console.log(previousUsers);
      const previousData = previousUsers.find((user) => user.id == userID);
      const dataIndex = previousUsers.indexOf(previousData);

      if (previousData) {
        for (const item in reqData) {
          if (item !== "id") {
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
});



/*
Sooo......this one is bulk update endpoint it takes an array of object and on basis of that it updates the previous information of multiple users in one go.
*/
router.patch("/bulk-update", (req, res) => {
  const reqData = req.body;

  //reading previous data
  fs.readFile("./users.json", async (err, data) => {
    if (err) console.log(err);
    const previousUsers = await JSON.parse(data);

    for (const itemData of reqData) {
      const userID = itemData.id;
      console.log(userID);

      if (userID) {
        const previousData = previousUsers.find((user) => user.id == userID);
        const dataIndex = previousUsers.indexOf(previousData);

        if (previousData) {
          for (const item in itemData) {
            if (item !== "id") {
              previousData[item] = itemData[item];
            }
          }
          // console.log(previousData);
          previousUsers[dataIndex] = previousData;
        }
      }
    }

    const finalData = JSON.stringify(previousUsers);
    // console.log(finalData);
    fs.writeFile("./users.json", finalData, (err) => {
      if (err) {
        res.send("Something went wrong");
      } else {
        res.send("Your desired data is updated");
      }
    });
  });
});


/*And the last one most simple and gorgeous delet endpoint. It get"s a id from param and deletes the info of user related to that id.   */
router.delete("/delete/:id", (req, res) => {
  console.log("delettt");
  fs.readFile("./users.json", async (err, data) => {
    if (err) console.log(err);
    const previousUsers = await JSON.parse(data);
    const userID = req.params.id;
    if (previousUsers.find((user) => user.id == userID)) {
      const currentData = previousUsers.filter((user) => user.id != userID);
      const finalData = JSON.stringify(currentData);
      if (currentData) {
        fs.writeFile("./users.json", finalData, (err) => {
          if (err) {
            res.send("Something went wrong");
          } else {
            res.send("User Deleted");
          }
        });
      }
    } else {
      res.send("No user found to delete");
    }
    // console.log(previousUsers);
  });
});

module.exports = router;
