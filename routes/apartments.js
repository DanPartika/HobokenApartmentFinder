//require express and express router as shown in lecture code
//! to implement a map https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript
const express = require("express");
const router = express.Router();
const data = require("../data");
const apartmentsData = data.Apartments;
const usersData = data.users
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET Done
    try {
      //! What do we want on our home page? apartment list already?? or ask what search parameters??
      /*  
      apartmentsList.forEach((apt) => {
        ans[ans.length] = { _id: apt._id, apartmentName: apt.apartmentName, streetAddress: apt.streetAddress, rentPerMonth: apt.rentPerMonth, numBedrooms: apt.numBedrooms, overallRating: apt.overallRating };
      });
*/
      res.json(ans);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let apartmentsPData = req.body;
    
  });

router
  .route("/:ApartmentId")
  .get(async (req, res) => {
    //code here for GET
    req.params.ApartmentId = req.params.ApartmentId.trim();
    if (!ObjectId.isValid(req.params.ApartmentId)) {
      res.status(400).json({ error: "invalid ObjectId" });
      return;
    }
    try {
      const mov = await apartmentsData.getApartmentById(req.params.ApartmentId);
      res.status(200).json(mov);
    } catch (e) {
      res.status(404).json({ error: "Apartment not found" });
    }
  })
  .delete(async (req, res) => {
    //code here for DELETE
    if (!req.params.ApartmentId) {
      res.status(400).json({ error: "You must supply id to delete Apartment" });
      return;
    }

    req.params.ApartmentId = req.params.ApartmentId.trim();

    if (!ObjectId.isValid(req.params.ApartmentId)) {
      res.status(400).json({ error: "Invalid ObjectID" });
      return;
    }
    try {
      const deleted = await apartmentsData.removeApartment(
        req.params.ApartmentId
      );
      let del = { ApartmentId: req.params.ApartmentId, deleted: true };
      res.status(200).json(del);
    } catch (e) {
      res.status(404).json({ error: e });
      return;
    }
  })
  .put(async (req, res) => {
    //code here for PUT
    if (!req.params.ApartmentId) {
      res.status(400).json({ error: "must supply and ID to delete" });
      return;
    }
    req.params.ApartmentId = req.params.ApartmentId.trim();
    if (!ObjectId.isValid(req.params.ApartmentId)) {
      res.status(400).json({ error: "Invalid ObjectID" });
      return;
    }

    let ApartmentsPData = req.body;
    try {
      let params = helpers.checkApartmentParameters(apartmentName, streetAddress,rentPerMonth,rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded);

    } catch (e) {
      //console.log("ERROR")
      res.status(400).json({ error: e });
      return;
    }

    try {
      
      res.status(200).json(newPost);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

module.exports = router;
