var imageContainers = document.getElementsByClassName("image-container");
let video = document.getElementsByClassName("desktop-video");

if (window.screen.width < 700) {
  video.load();
}

for (var i = 1; i < imageContainers.length; i++) {
  imageContainers[i].style.display = "none";
}
function showImage(index) {
  for (var i = 0; i < imageContainers.length; i++) {
    imageContainers[i].style.display = "none";
  }
  imageContainers[index].style.display = "block";
}
