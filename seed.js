const apartments = require('./data/apartments');
const reviews = require('./data/reviews');
const users = require('./data/users');
const connection = require('./config/mongoConnection');

const main = async () => 
{
    const db = await connection.dbConnection();
    await db.dropDatabase();

//   apartmentName, //do we need users' id here?
//   streetAddress,
//   rentPerMonth,
//   rentDuration,
//   maxResidents,
//   numBedrooms,
//   numBathrooms,
//   laundry,
//   floorNum,
//   roomNum,
//   appliancesIncluded,
//   maxPets,
//   utilitiesIncluded

    try
    {
        let user1 = await users.createUser("Cody","Fernandez","cfernan2@stevens.edu","Male","20","CodyF02","Password1!");
        let user2 = await users.createUser("Daniel","Partika","dpartika@stevens.edu","Male","20","Dan1","Password1!");
        let user3 = await users.createUser("Elton","Vaz","evaz@stevens.edu","Male","20","eltonvaz623","Eltonv#05");
        let user4 = await users.createUser("Hari","Shankar","srishankar@stevens.edu","Male","20","SriBL","Password1!");
        let user5 = await users.createUser("Rando","Noname","idk21@gmail.com","Male","39","RandoMan","Password1!");


        let apartment1 = await apartments.createApartment("CodyF02","Cody's Place","101 Jeffereson St", "2000", "24", "3", "3", "1", false, "2", "2C", ["Toaster,TV"], true, ["N/A"]);
        await users.addApartmentUser(apartment1,"codyf02");

        let apartment2 = await apartments.createApartment("dan1","Daniel's Place","302 Jackson St", "1000", "12", "1", "1", "1", true, "2", "2A", ["N/A"], false, ["N/A"]);
        await users.addApartmentUser(apartment2,"dan1");

        let apartment3 = await apartments.createApartment("eltonvaz623","Elton's Place","920 Washington St", "3000", "10", "4", "4", "2", true, "1", "1C", ["Fridge,TV,Oven"], true, ["Water,Electric"]);
        await users.addApartmentUser(apartment3,"eltonvaz623");
        
        let apartment4 = await apartments.createApartment("SriBL","Hari's Place","465 Vezzetti Way", "1500", "12", "2", "1", "1", false, "5", "5A", ["Toaster"], false, ["N/A"]);
        await users.addApartmentUser(apartment4,"sribl");
        
        let apartment5 = await apartments.createApartment("RandoMan","Rando's Place","901 Park Ave", "500", "12", "1", "1", "1", false, "2", "2B", ["N/A"], false, ["N/A"]);
        await users.addApartmentUser(apartment5,"randoman");


        let review1 = await reviews.createReview(apartment5, "CodyF02", "Mid","2.5");
        await users.addReviewUser(review1._id,"codyf02",apartment5);

        let review2 = await reviews.createReview(apartment1, "dan1", "Awesome","5.0");
        await users.addReviewUser(review2._id,"dan1",apartment5);

        let review3 = await reviews.createReview(apartment2, "sribl", "I like it","3.0");
        await users.addReviewUser(review3._id,"sribl",apartment5);

        let review4 = await reviews.createReview(apartment3, "randoman", "Horrible","1.0");
        await users.addReviewUser(review4._id,"randoman",apartment5);

        let review5 = await reviews.createReview(apartment4, "eltonvaz623", "Mbappe","4.0");
        await users.addReviewUser(review5._id,"eltonvaz623",apartment5);


    } 
    catch (e) 
    {
      console.log(e);
    } 
    
      
    await connection.closeConnection();

}

main();