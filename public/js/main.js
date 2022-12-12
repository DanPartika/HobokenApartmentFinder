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

$(document).ready(function(e) {
  $("#likeReviewForm").click(function(e) { //btn1 is button id
    var o = $(this).val();
    o++;
    $(this).val(o);
  });
});