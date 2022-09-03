const express = require("express");
const fs = require("fs");
const userControllers = require("./users.controllers");
const router = express.Router();




  /* 
  this get endpoint provides us with a random user each time.
  
  */

  
router.get("/random",userControllers.getRandomUser);


/*  
this get user/all endponit provides us list of all users and while this endpoint is hit with a query parameter (s) with a number define it limits the count of user and provides us a number of user according the number provided as query parameter
*/

router.get("/all",userControllers.getAllUser);


/*
THis post endpoint stores data in users.json file,to do so we need to provide this with some required info about a user we want to save without proper information it will decline our saving request.
*/
router.post("/save",userControllers.saveUser);

/*
This patch end point facilites us updating an user's information on basis of user id it perfoms and query and determines where a change needed to be happen and preform accordingly and all is patched according to the request body(object provided)
*/

router.patch("/update/:id",userControllers.patchUser);



/*
Sooo......this one is bulk update endpoint it takes an array of object and on basis of that it updates the previous information of multiple users in one go.
*/
router.patch("/bulk-update",userControllers.updateBulk);


/*And the last one most simple and gorgeous delet endpoint. It get"s a id from param and deletes the info of user related to that id.   */
router.delete("/delete/:id",userControllers.deleteUser);

module.exports = router;
