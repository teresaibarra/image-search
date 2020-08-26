/**
 * 
 * DOCUMENT ELEMENTS
 * 
 */

var viewerInstructions = document.getElementById("viewer-instructions");
var largeImage = document.getElementById("large-image");
var largeImageTitle = document.getElementById("image-title");
var largeImageUsername = document.getElementById("image-username");
var thumbnailContainer = document.getElementById("thumbnails-container");
var errorMessage = document.getElementById("error-message");
var loadingSpinner = document.getElementById("loading-spinner");

/**
 * 
 * HELPER FUNCTIONS
 * 
 */

// Return the file extension of the given filename
function getFileExtension(filename) {
    return filename.split('.').pop();
}

// Event handler that will fade in an element
function fadeIn() {
    this.style.transition = "opacity 2s";
    this.style.opacity = "1";
}

// Hides all search results and displays loading spinner
function clearInterface() {
    loadingSpinner.style.display = "flex";
    viewerInstructions.style.display = "none";
    errorMessage.textContent = "";

    largeImage.setAttribute("src", "");
    largeImageTitle.textContent = "";
    largeImageUsername.textContent = "";

    // Remove all thumbnails from thumbnail container
    while(thumbnailContainer.firstChild) {
        thumbnailContainer.removeChild(thumbnailContainer.firstChild);
    }
}

/**
 * 
 * GENERAL FUNCTIONS
 * 
 */

 // Gets query from input text, clears interface, sends request, and then processes it
function getQuery() {
    // We ask for .png files to reduce errors with displaying mp4 files
    var requestUrl = "https://api.imgur.com/3/gallery/search/?q_type=png&q_exactly=";
    // Clean up input text before submitting request
    var queryText = document.getElementById("query").value.trim();

    clearInterface();
    
    fetch(requestUrl + queryText, {
        credentials: 'omit', // Reduces likelihood of SameSite cookie error
        headers: {
            "Authorization": "Client-ID b067d5cb828ec5a",
          }
    })
        .then(response => response.json())
        .then(function (data) {
            displayResults(data);
        })
        .catch(function (error) {
            errorMessage.textContent = error; // Show any errors to user if query is invalid
        });
}

// Show search results from Imgur API in thumbnail gallery
function displayResults(data) {
    var results = data.data;
    var imageCount = 0;

    for (var result of results) {
        if (!result.nsfw && result.images && getFileExtension(result.images[0].link) != "mp4") {
            imageCount++;

            // Create a thumbnail wrapper that allows the images to be clicked and opens
            // image in a larger viewer
            var thumbnailWrapper = document.createElement("a");
            thumbnailWrapper.setAttribute("href", "#");  
            thumbnailWrapper.setAttribute("onclick", "openImageViewer('img-" + result.id +"')");          

            // Store information about the thumbnail to be shown in larger view
            var thumbnail = document.createElement("img");
            thumbnail.setAttribute("class", "thumbnail");
            thumbnail.setAttribute("id", "img-" + result.id);
            thumbnail.setAttribute("src", result.images[0].link);
            thumbnail.setAttribute("title", result.title);
            thumbnail.setAttribute("data-username", result.account_url);

            // When the image loads, fade it in
            thumbnail.addEventListener("load", fadeIn);
            thumbnail.style.opacity = "0";

            thumbnailWrapper.appendChild(thumbnail); 
            thumbnailContainer.appendChild(thumbnailWrapper);

            if (imageCount == 30) {
                // Show 30 image thumbnails max
                break;
            }
        }
    }

    if (imageCount) {
        // If relevant results were found, show instructions for larger images
        viewerInstructions.style.display = "flex";
    }
    else {
        // If relevant results were not found, show error message to user
        errorMessage.textContent = "No images found.";
    }

    loadingSpinner.style.display = "none"; 
}

// If an image is clicked, show a larger version of the image with its title and the uploader's username
function openImageViewer(id) {
    var thumbnail = document.getElementById(id);
    var imageSrc = thumbnail.getAttribute("src");
    var imageTitle = thumbnail.getAttribute("title");
    var imageUsername = thumbnail.getAttribute("data-username");

    viewerInstructions.style.display = "none"; // Remove larger view instructions to make space for image
    largeImage.setAttribute("src", imageSrc);
    largeImageUsername.textContent = imageUsername;
    largeImageTitle.textContent = imageTitle;
}
