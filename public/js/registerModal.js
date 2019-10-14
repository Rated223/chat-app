// Get the modal
var modal = document.getElementById("modal-register");

// When the user clicks on the button, open the modal
window.addEventListener('load', () => {
  modal.style.display = "block";
});

// When the user clicks on <span> (x), close the modal
document.querySelector(".close").addEventListener('click',() => {
  modal.style.display = "none";
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
} 