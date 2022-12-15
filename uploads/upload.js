// const image_input = document.querySelector("#image-input");

// image_input.addEventListener("change", function() {
//   const reader = new FileReader();
//   reader.addEventListener("load", () => {
//     const uploaded_image = reader.result;
//     document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
//   });
//   reader.readAsDataURL(this.files[0]);
// });
function showPreview(event){
    if(event.target.files.length > 0){
      var src = URL.createObjectURL(event.target.files[0]);
      var preview = document.getElementById("image-input");
      preview.src = src;
      preview.style.display = "block";
    }
  }