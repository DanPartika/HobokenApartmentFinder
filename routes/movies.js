//require express and express router as shown in lecture code
const express = require("express");
const router = express.Router();
const data = require("../data");
const ApartmentsData = data.Apartments;
const { ObjectId } = require("mongodb");
const helpers = require("../helpers");

router
  .route("/")
  .get(async (req, res) => {
    //code here for GET Done
    try {
      const ApartmentsList = await ApartmentsData.getAllApartments();
      let ans = [];
      ApartmentsList.forEach((mov) => {
        ans[ans.length] = { _id: mov._id, title: mov.title };
      });

      res.json(ans);
    } catch (e) {
      res.status(500).send(e);
    }
  })
  .post(async (req, res) => {
    //code here for POST
    let ApartmentsPData = req.body;
    try {
      helpers.checkString(ApartmentsPData.plot);
      helpers.checkArray(ApartmentsPData.genres);
      helpers.checkString(ApartmentsPData.rating);
      helpers.checkString(ApartmentsPData.studio);
      helpers.checkString(ApartmentsPData.director);
      helpers.checkArray(ApartmentsPData.castMembers);
      helpers.checkString(ApartmentsPData.dateReleased);
      helpers.checkString(ApartmentsPData.runtime);

      ApartmentsPData.title = ApartmentsPData.title.trim();
      ApartmentsPData.plot = ApartmentsPData.plot.trim();
      ApartmentsPData.genres.forEach((genre) => {
        genre = genre.trim();
        //console.log( "genre" +genre );
      });
      ApartmentsPData.rating = ApartmentsPData.rating.trim();
      ApartmentsPData.studio = ApartmentsPData.studio.trim();
      ApartmentsPData.director = ApartmentsPData.director.trim();
      ApartmentsPData.castMembers.forEach((castMember) => {
        castMember = castMember.trim();
        //console.log( castMember );
      });
      ApartmentsPData.dateReleased = ApartmentsPData.dateReleased.trim();
      ApartmentsPData.runtime = ApartmentsPData.runtime.trim();
      //?trim reviews array?

      helpers.checkTitle(ApartmentsPData.title);
      helpers.checkStudio(ApartmentsPData.studio);
      helpers.checkDirector(ApartmentsPData.director);
      helpers.checkRating(ApartmentsPData.rating);
      helpers.checkGenres(ApartmentsPData.genres);
      helpers.checkCastMembers(ApartmentsPData.castMembers);
      helpers.checkDateReleased(ApartmentsPData.dateReleased);
      helpers.checkRuntime(ApartmentsPData.runtime);
      if (Object.keys(ApartmentsPData).length > 9) {
        res.status(400).json({ error: "Too many parameters in object" });
        return;
      }
    } catch (e) {
      res.status(400).json({ error: e });
      return;
    }
    try {
      const {
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime,
      } = ApartmentsPData;
      const newPost = await ApartmentsData.createApartment(
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime
      );
      res.status(200).json(newPost);
    } catch (e) {
      res.status(400).json({ error: e });
    }
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
      const mov = await ApartmentsData.getApartmentById(req.params.ApartmentId);
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
      const deleted = await ApartmentsData.removeApartment(
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
      helpers.checkString(ApartmentsPData.plot);
      helpers.checkArray(ApartmentsPData.genres);
      helpers.checkString(ApartmentsPData.rating);
      helpers.checkString(ApartmentsPData.studio);
      helpers.checkString(ApartmentsPData.director);
      helpers.checkArray(ApartmentsPData.castMembers);
      helpers.checkString(ApartmentsPData.dateReleased);
      helpers.checkString(ApartmentsPData.runtime);
      ApartmentsPData.title = ApartmentsPData.title.trim();
      ApartmentsPData.plot = ApartmentsPData.plot.trim();

      ApartmentsPData.genres.forEach((genre) => {
        genre = genre.trim();
      });
      ApartmentsPData.rating = ApartmentsPData.rating.trim();
      ApartmentsPData.studio = ApartmentsPData.studio.trim();
      ApartmentsPData.director = ApartmentsPData.director.trim();
      //console.log( ApartmentsPData.director );
      ApartmentsPData.castMembers.forEach((castMember) => {
        castMember = castMember.trim();
        //console.log( castMember );
      });
      ApartmentsPData.dateReleased = ApartmentsPData.dateReleased.trim();
      //console.log( ApartmentsPData.dateReleased );
      ApartmentsPData.runtime = ApartmentsPData.runtime.trim();
      //console.log( ApartmentsPData.runtime );
      //?trim reviews array?
      //console.log("here1")
      helpers.checkTitle(ApartmentsPData.title);
      helpers.checkStudio(ApartmentsPData.studio);
      helpers.checkDirector(ApartmentsPData.director);
      helpers.checkRating(ApartmentsPData.rating);
      helpers.checkGenres(ApartmentsPData.genres);
      helpers.checkCastMembers(ApartmentsPData.castMembers);
      helpers.checkDateReleased(ApartmentsPData.dateReleased);
      helpers.checkRuntime(ApartmentsPData.runtime);
      //console.log("here3")
    } catch (e) {
      //console.log("ERROR")
      res.status(400).json({ error: e });
      return;
    }

    try {
      //console.log("here12")
      const {
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime,
      } = ApartmentsPData;
      //console.log("here12")
      const newPost = await ApartmentsData.updateApartment(
        req.params.ApartmentId,
        title,
        plot,
        genres,
        rating,
        studio,
        director,
        castMembers,
        dateReleased,
        runtime
      );
      //console.log("here12")
      res.status(200).json(newPost);
    } catch (e) {
      res.status(404).json({ error: e });
    }
  });

module.exports = router;
