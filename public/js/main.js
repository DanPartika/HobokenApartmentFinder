
var likeReviewForm = $('#likeReviewForm');

likeReviewForm.submit(async function (event) {
  event.preventDefault();
  //let aptData = axios.get('http://localhost:3000/getApartments');
  axios.get('/getReview/:id').then((response) => {
    console.log(response.data); 
    //todo display new num likes 
  }, (error) => {
    console.log(error);
  });
  
  // document.addEventListener("DOMContentLoaded", function() {
//   fetch('http://localhost:3000/apartments/apartment/63977361f5435a2db481a4ab')
//   .then(resourse => resourse.json())
//   .then((data) => {

//   })
// })


  //!Change add review to client side
  //Have a user upload on add apt page and store the path in mongo to later access it.
  //todo set likes with a post request 
    /*todo  Like this
     * axios.post('/login', {  // id of apt and user, send those to server to increment (increment happens in route that calls data)
  firstName: 'Finn',
  lastName: 'Williams'
})
.then((response) => {
  console.log(response);
}, (error) => {
  console.log(error);
});
     */
  
  //console.log(aptData);
});


//var likeButton = $('#likeButton');
//disable like button

//axios

//!==========================================================================


//const { getAllApartments } = require("../../data/apartments");


// const sortApartmentsBy = (apts, by) => {
//   switch (by) {
//     case "Cost":
//       apts.sort((a,b) => (a.rentPerMonth > b.rentPerMonth) ? 1 : -1);
//       break;

//     case "NumBed":
//       apts.sort((a,b) => (a.numBedrooms > b.numBedrooms) ? 1 : -1);
//       break;

//     case "NumBath":
//       apts.sort((a,b) => (a.numBathrooms > b.numBathrooms) ? 1 : -1);
//       break;

//     case "NumRes":
//       apts.sort((a,b) => (a.maxResidents > b.maxResidents) ? 1 : -1);
//       break;

//     case "PetsAll":
//       const aptsPets = apts.filter(apts => apts.maxPets == true);
//       return aptsPets;
//       break;

//     default:
//       break;
//   }

//   return apts;
// }


// let form = document.getElementById("sortByform");
// let input = document.getElementById("sortByInput");
// let results = document.getElementById("results");
// console.log("in client code")

// if (form){
//   form.addEventListener('submit', e => {
//   e.preventDefault()
//     try {
//       console.log("Daniel" + input.value);
//       const sortBy = input.value;
//       //const apts = await getAllApartments();
//       const sortedApts = sortApartmentsBy(apts, sortBy);
      

//       const listItem = document.createElement('li');

        

//       const text = `${sortedApts}`;
//       const content = document.createTextNode(text);
//       listItem.appendChild(content);
//       results.appendChild(listItem);
//       //form.reset();
//     } catch (e) {
//       alert(e);
//     }
//   });
// }



// document.addEventListener("DOMContentLoaded", function() {
//   fetch('http://localhost:3000/apartments/apartment/63977361f5435a2db481a4ab')
//   .then(resourse => resourse.json())
//   .then((data) => {

//   })
// })





// $(document).ready(function(e) {
//   $("#likeReviewForm").click(function(e) { 
//     var o = $(this).val();
//     o++;
//     $(this).val(o);
//   });
// });