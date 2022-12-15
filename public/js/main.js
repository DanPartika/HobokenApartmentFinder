
var likeReviewForm = $('#likeReviewForm');
var revId = document.getElementById('likeReviewForm')
console.log("LIKE: " + JSON.stringify(revId))

likeReviewForm.submit(async function (event) {
  //console.log("EVENT: " + event + "\n\n\n" + event.target.querySelector('button').id)
  event.preventDefault();
  
  //let aptData = axios.get('http://localhost:3000/getApartments');
  await axios.get(`/getReview/${event.target.querySelector('button').id}`).then((response) => {
    //console.log("Dan" + response.data); 
    //todo display new num likes using a selector 
    
  }, (error) => {
    console.log(error);
  });
});
var dislikeReviewForm = $('#dislikeReviewForm');
var revId1 = document.getElementById('dislikeReviewForm')
console.log("DISLIKE: " + JSON.stringify(revId1))

dislikeReviewForm.submit(async function (event) {
  console.log("EVENT: " + event + "\n\n\n" + event.target.querySelector('button').id)
  event.preventDefault();
  await axios.get(`/getReview/${event.target.querySelector('button').id}`).then((response) => {
    console.log("Dan" + response.data); 
    //todo display new num likes using a selector 
  }, (error) => {
    console.log(error);
  });

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



//var likeButton = $('#likeButton');
//disable like button

//axios

//!==========================================================================

