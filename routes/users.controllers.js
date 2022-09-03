

const fs = require("fs");


//utility functions
const randomIndex = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomUser = (req, res) => {
        //reading json file which contains users
        fs.readFile("./users.json", (err, data) => {
          if (err) console.log(err);
          const initialData = JSON.parse(data);
          if (initialData) {
            const user = randomIndex(0, initialData.length - 1);

            res.send(initialData[user]);
          }
        });
        
      };


const getAllUser = (req, res) => {
        const userCount = parseInt(req.query.s);
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
      };


const saveUser =  async (req, res) => {
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
};

const patchUser = (req, res) => {
  const userID = req.params.id;
  const reqData = req.body;
  const newData = Object.keys(reqData);

  if (userID) {
    fs.readFile("./users.json", async (err, data) => {
      if (err) console.log(err);
      const previousUsers = await JSON.parse(data);
      const previousData = previousUsers.find((user) => user.id == userID);
      const dataIndex = previousUsers.indexOf(previousData);

      if (previousData) {
        for (const item in reqData) {
          if (item !== "id") {
            previousData[item] = reqData[item];
          }
        }
        previousUsers[dataIndex] = previousData;
        const finalData = JSON.stringify(previousUsers);
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
};

const updateBulk = (req, res) => {
  const reqData = req.body;

  //reading previous data
  fs.readFile("./users.json", async (err, data) => {
    if (err) console.log(err);
    const previousUsers = await JSON.parse(data);

    for (const itemData of reqData) {
      const userID = itemData.id;

      if (userID) {
        const previousData = previousUsers.find((user) => user.id == userID);
        const dataIndex = previousUsers.indexOf(previousData);

        if (previousData) {
          for (const item in itemData) {
            if (item !== "id") {
              previousData[item] = itemData[item];
            }
          }
          previousUsers[dataIndex] = previousData;
        }
      }
    }

    const finalData = JSON.stringify(previousUsers);
    fs.writeFile("./users.json", finalData, (err) => {
      if (err) {
        res.send("Something went wrong");
      } else {
        res.send("Your desired data is updated");
      }
    });
  });
};


const deleteUser =  (req, res) => {
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
  });
};

module.exports = {
    getAllUser,
    getRandomUser,
    saveUser,
    patchUser,
    updateBulk,
    deleteUser
}