//require express and express router as shown in lecture code
//! to implement a map https://developers.google.com/maps/documentation/javascript/overview#maps_map_simple-javascript
const express = require("express");
const router = express.Router();
const data = require("../data");
const apartmentsData = data.Apartments;
const usersData = data.users
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");
const { getApartmentById, createApartment, getAllApartments, sortApartmentByCost } = require("../data/apartments");
const path = require('path');

// router.route("/") //homepage
//   .get(async (req, res) => {
//     //code here for GET
//     return res.sendFile(path.resolve('static/homepage.html'));
//   });

router.route("/") //homepage
  .get(async (req, res) => {
    //code here for GET
    return res.sendFile(path.resolve('static/homepage.html'));
  });

router
  .route("/apartments") //apt list
  .get(async (req, res) => {
    try {
     
      if (req.session.user) {
        const apts = await getAllApartments();
        let apartmentData = req.body;
        let sortCondition = apartmentData.sortByInput;
        //if (apts.length == 0) return res.status(404).render("error",{title:"No Apartments Found", message: "Error code: 404, no apartments found"})

        if (sortCondition == "Cost") {
          console.log("Cost")
          apts = await sortApartmentByCost();
        } else {
          
        }
        const data = {apt:apts};
        return res.render('apartments/aptList', data);
      }
      else return res.redirect('/users/login');
    } catch (error) {
      return res.render('error',{title:error})
    }
   
  })
  .post(async (req, res) => {
    if (req.session.user) {
      return res.render('apartments/addApt')
    } else {
      return res.render('userAccount/login')
    }
  });


router
  .route("/apartments/apartment/:apartmentId") //singular apt
  .get(async (req, res) => {
    //code here for GET
    if (req.session.user) {
      try {
        const title = "Apartment Found";
        req.params.apartmentId = helpers.checkID(req.params.apartmentId);
        //let apt = {};
        try{
          const apt = await getApartmentById(req.params.apartmentId); //!idk if this saves outside the try catch
          const tempData = {title: title, apt:apt};
          return res.render("apartments/apartment",tempData);
        } catch (e) {
          return res.status(400).render("error", {title: "Apartment Not Found", message: "400 Error: Apartment not found."});  // can alert this instead
        }
        
      } catch (e) {
        
        return res.status(404).render("error", {title: "Apartment Not Found", message: "404 Error: Page not found."});
      }
    } else {
      return res.render('userAccount/login');
    }
  })

router
  .route("/apartments/add-new-apartment")
  .get(async (req,res) => {
    if (req.session.user) {
      return res.render('apartments/addApt');
    } else {
      return res.render('userAccount/login',{});
    }
  })
  .post(async (req,res) => {
    if (req.session.user) {
      // return res.render('apartments/addApt');
      try{
        let apartmentData = req.body;
        let apartmentName = apartmentData.apartmentNameInput; 
        let streetAddress = apartmentData.streetAddressInput;
        let rentPerMonth = apartmentData.rentPerMonthInput;
        let rentDuration = apartmentData.rentDurationInput;
        let maxResidents = apartmentData.maxResidentsInput;
        let numBedrooms = apartmentData.numBedroomsInput;
        let numBathrooms = apartmentData.numBathroomsInput;
        let laundry = apartmentData.laundryInput;
        if(laundry == "true") laundry = true
        else if(laundry == "false") laundry = false
        let floorNum = apartmentData.floorNumInput;
        let roomNum = apartmentData.roomNumInput;
        let appliancesIncluded = apartmentData.appliancesIncludedInput;
        appliancesIncluded = appliancesIncluded.split(",");
        let maxPets = apartmentData.maxPetsInput;
        let utilitiesIncluded = apartmentData.utilitiesIncludedInput;
        utilitiesIncluded = utilitiesIncluded.split(",")
        //console.log(laundry)
      
        let apt = await createApartment(apartmentName, streetAddress, rentPerMonth, rentDuration, maxResidents, numBedrooms, numBathrooms, laundry, floorNum, roomNum, appliancesIncluded, maxPets, utilitiesIncluded);
        // if(!apt.overallRating == 0) return res.render('error',{title:"Error in creating apartment"});
        console.log(apt)
        let pathRedirect = '/apartments/apartment/' + apt;
        console.log(apt);
        res.redirect(pathRedirect);
      } catch (e) {
        return res.render('error',{title:"Error in creating apartment", message:e});
      }


    } else {
      return res.render('userAccount/login',{});
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