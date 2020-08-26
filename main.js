var loadingSpinner = document.getElementById("loading-image");
var viewerText = document.getElementById("viewer-text");
var largeImage = document.getElementById("large-image");
var largeImageTitle = document.getElementById("image-title");
var errorMessage = document.getElementById("error-message");
var usernameText = document.getElementById("username");

function getQuery() {
    var requestUrl = "https://api.imgur.com/3/gallery/search/?q_type=png&q_exactly=";
    var queryText = document.getElementById("query").value.trim();
    var thumbnailContainer = document.getElementById("thumbnail-container");

    loadingSpinner.style.display = "flex";
    viewerText.style.display = "none";
    errorMessage.textContent = "";

    largeImage.setAttribute("src", "")
    largeImageTitle.textContent = "";
    usernameText.textContent = "";

    while(thumbnailContainer.firstChild) {
        thumbnailContainer.removeChild(thumbnailContainer.firstChild);
    }
    
    fetch(requestUrl + queryText, {
        credentials: 'omit',
        headers: {
            "Authorization": "Client-ID b067d5cb828ec5a",
          }
    })
        .then(response => response.json())
        .then(function (data) {
            displayResults(data)
        })
        .catch(function (error) {
            errorMessage.textContent = error;
        });
}

function getFileExtension(filename) {
    return filename.split('.').pop()
}

function displayResults(data) {
    var results = data.data;
    var thumbnailContainer = document.getElementById("thumbnail-container");
    var imagesLoaded = 0;
    var imageCount = 0;
    
    for (result of results) {
        if (!result.nsfw && result.images && getFileExtension(result.images[0].link) != "mp4") {
            imageCount++;
            var thumbnailWrapper = document.createElement("a");
            thumbnailWrapper.setAttribute("href", "#");  
            thumbnailWrapper.setAttribute("onclick", "openViewer('img-" + result.id +"')");                                         
            var thumbnail = document.createElement("img");
            if (result.images) {
                thumbnail.addEventListener("load", fadeIn);
                thumbnail.style.opacity = "0";
                thumbnail.setAttribute("src", result.images[0].link);
                thumbnail.setAttribute("id", "img-" + result.id);
                thumbnail.setAttribute("title", result.title)
                thumbnail.setAttribute("class", "thumbnail");
                thumbnail.setAttribute("data-username", result.account_url)
                thumbnailWrapper.appendChild(thumbnail); 
                thumbnailContainer.appendChild(thumbnailWrapper);
            }

            thumbnail.onload = function(){
                imagesLoaded++;
                if(imagesLoaded == imageCount){
                    viewerText.style.display = "flex";
                    loadingSpinner.style.display = "none"; 
                }
            }

            if (imageCount == 30) {
                break
            }
        }
    }

    if (!imageCount) {
        loadingSpinner.style.display = "none"; 
        errorMessage.textContent = "No images found.";
    }
}

function fadeIn() {
    this.style.transition = "opacity 2s";
    this.style.opacity = "1";
}

function openViewer(id) {
    var thumbnail = document.getElementById(id);
    var imageSrc = thumbnail.getAttribute("src");
    var imageTitle = thumbnail.getAttribute("title");
    var imageUsername = thumbnail.getAttribute("data-username");

    viewerText.style.display = "none";
    largeImage.setAttribute("src", imageSrc);
    usernameText.textContent = imageUsername;
    largeImageTitle.textContent = imageTitle;
}