// script to handle tabs
document.addEventListener("DOMContentLoaded", function () {
  // Function to clear all active states
  function clearActiveStates() {
    document.querySelectorAll(".tab").forEach((tab) => {
      tab.classList.remove(
        "text-lime-600",
        "border-lime-600",
        "dark:text-blue-500",
        "dark:border-blue-500",
        "border-b-2"
      );
    });
    document.querySelectorAll(".tab-content").forEach((content) => {
      content.classList.add("hidden");
    });
  }

  // Initialize tabs
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", function (e) {
      e.preventDefault();
      const contentId = this.getAttribute("href").substring(1);

      clearActiveStates();

      // Set active state for clicked tab
      this.classList.add(
        "text-lime-600",
        "border-lime-600",
        "dark:text-blue-500",
        "dark:border-blue-500",
        "border-b-2"
      );

      document.getElementById(contentId).classList.remove("hidden");
    });
  });
});

// script to show uploaded image
document
  .querySelector("#dropzone-file")
  .addEventListener("change", function () {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      var uploadedImage = document.querySelector("#uploaded-image");
      var dropzoneText = document.querySelector("#dropzone-text");
      dropzoneText.style.display = "none";
      uploadedImage.src = e.target.result;
      uploadedImage.style.display = "block";
    };
    reader.readAsDataURL(file);
  });

// script to handle image upload
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();
  var fileInput = document.querySelector("#dropzone-file");
  var errorMessage = document.querySelector("#error-message");
  if (fileInput.files.length === 0) {
    errorMessage.style.display = "block";
    return;
  }
  errorMessage.style.display = "none";
  var formData = new FormData(event.target);

  var imageElement = document.querySelector("#preview");
  var downloadButton = document.querySelector("#download");
  var previewContainer = document.querySelector("#previewContainer");
  var submitButtonText = document.querySelector("#submit-button-text");

  submitButtonText.textContent = "Generating...";

  fetch("/", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.blob())
    .then((image) => {
      var url = URL.createObjectURL(image);
      imageElement.src = url;
      downloadButton.href = url;
      downloadButton.download = "image.png";
      previewContainer.style.display = "block";
      submitButtonText.textContent = "Generate";
    })
    .catch((error) => {
      submitButtonText.textContent = "Generate";
      console.error("Error:", error);
    });
});
