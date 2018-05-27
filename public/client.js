let slideIndex = 1;
showSlides(slideIndex);

// const cedulaInput = document.getElementById('cedula-input');
const stringInput = document.getElementById('string-input');
// cedulaInput.addEventListener('change', (e) => uploadCedulaImg(e.target.files));
stringInput.addEventListener('change', (e) => uploadStringImg(e.target.files));

function plusSlides(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) {slideIndex = 1}    
  if (n < 1) {slideIndex = slides.length}
  
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";  
  }
  
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex-1].style.display = "block";  
  dots[slideIndex-1].className += " active";
}

// function uploadCedulaImg(img) {
//   console.log("uploadCedulaImg() invoked");
//   console.log(img);
//   $.ajax({
//     type: "POST",
//     url: '/upload',
//     data: img,
//     success: function () {
//       console.log('success');
//     },
//     dataType: dataType
//   });
// }

function uploadStringImg(img) {
  console.log("uploadStringImg() invoked");
  data.stringImg = img;
  console.log(data);
}

function connectWithUport() {
  $.get( "/uport-app-link", function(link) {
    // window.open(link, '_blank')
    window.location = link
  });
}