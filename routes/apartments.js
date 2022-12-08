//require express and express router as shown in lecture code
//! to implement a map https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript
const express = require("express");
const router = express.Router();
const data = require("../data");
const apartmentsData = data.Apartments;
const usersData = data.users
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");
const { getApartmentById } = require("../data/apartments");
const path = require('path');

router.route("/") //homepage
  .get(async (req, res) => {
    //code here for GET
    return res.sendFile(path.resolve('static/homepage.html'));
  });
  /**
   * .post(async (req,res) => {
   *  return res.render(req.)
   * })
   *  
   * */
  

router.route("/apartments") //apt list
  .get(async (req, res) => {
    if (req.session.user) return res.render('apartments/aptList');
    else return res.redirect('users/login');
  })
  .post(async (req, res) => {
    if (req.session.user) {
      return res.render('apartments/addApt')
    } else {
      return res.render('userAccount/login')
    }
  });

router
  .route("/apartments/:ApartmentId") //singular apt
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      try {
        const title = "Apartment Found";
        const ApartmentId = helpers.checkID(req.params.ApartmentId);
        //let apt = {};
        try{
          const apt = await getApartmentById(ApartmentId); //!idk if this saves outside the try catch
        } catch (e) {
          return res.status(400).render("error", {title: "Apartment Not Found", message: "400 Error: Apartment not found."});  // can alert this instead
        }
        const tempData = {title: title, apt:apt};
        return res.render("apartment",tempData);
      } catch (e) {
        
        return res.status(404).render("error", {title: "Apartment Not Found", message: "404 Error: Page not found."});
      }
    } else {
      return res.render('userAccount/login');
    }
  })
  // .delete(async (req, res) => {
  //   //code here for DELETE
  //   //!make sure user is logged in
  //   if (!req.params.ApartmentId) { 
  //     res.status(400).json({ error: "You must supply id to delete Apartment" });
  //     return;
  //   }

  //   req.params.ApartmentId = req.params.ApartmentId.trim();

  //   if (!ObjectId.isValid(req.params.ApartmentId)) {
  //     res.status(400).json({ error: "Invalid ObjectID" });
  //     return;
  //   }
  //   try {
  //     const deleted = await apartmentsData.removeApartment(
  //       req.params.ApartmentId
  //     );
  //     let del = { ApartmentId: req.params.ApartmentId, deleted: true };
  //     res.status(200).json(del);
  //   } catch (e) {
  //     res.status(404).json({ error: e });
  //     return;
  //   }
  // })

  /*
  .post(async (req, res) => { // todo adding new apartment
    //code here for PUT
    if (req.session.user) {
      return res.render('apartments/addApt')
    }
    else {
      return res.render('userAccount/login')
    }

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
  });*/



module.exports = router;
