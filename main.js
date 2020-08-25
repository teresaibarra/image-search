var loadingText = document.getElementById("loading-text");
var viewerText = document.getElementById("viewer-text");
var largeImage = document.getElementById("large-image");
var largeImageTitle = document.getElementById("image-title");

function getQuery() {
    var requestUrl = "https://api.imgur.com/3/gallery/search/?q=";
    var queryText = document.getElementById("query").value.trim();
    var thumbnailContainer = document.getElementById("thumbnail-container");

    loadingText.style.display = "flex";
    viewerText.style.display = "none";

    largeImage.setAttribute("src", "")
    largeImageTitle.textContent = "";

    while(thumbnailContainer.firstChild) {
        thumbnailContainer.removeChild(thumbnailContainer.firstChild);
    }
    
    
    fetch(requestUrl + queryText, {
        headers: {
            "Authorization": "Client-ID b067d5cb828ec5a",
          }
    })
        .then(response => response.json())
        .then(data => displayResults(data))
        .catch(function (error) {
            console.log("Error: " + error);
            // TODO: add error to UI
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
    thumbnailContainer.style.display = "none";

    for (result of results) {
        if (!result.nsfw && getFileExtension(result.images[0].link) != "mp4") {
            imageCount++;
            var thumbnailWrapper = document.createElement("a");
            thumbnailWrapper.setAttribute("href", "#");  
            thumbnailWrapper.setAttribute("onclick", "openViewer('img-" + result.id +"')");                                         
            var thumbnail = document.createElement("img");
            thumbnail.setAttribute("src", result.images[0].link);
            thumbnail.setAttribute("id", "img-" + result.id);
            thumbnail.setAttribute("title", result.title)
            thumbnail.setAttribute("class", "thumbnail");
            thumbnailWrapper.appendChild(thumbnail); 
            thumbnailContainer.appendChild(thumbnailWrapper);

            thumbnail.onload = function(){
                imagesLoaded++;
                if(imagesLoaded == imageCount){
                    thumbnailContainer.style.display = "flex";
                    loadingText.style.display = "none"; 
                    viewerText.style.display = "flex";
                }
            }
        }
    }
    
}

function openViewer(id) {
    var thumbnail = document.getElementById(id);
    var imageSrc = thumbnail.getAttribute("src");
    var imageId = thumbnail.getAttribute("id");
    var imageTitle = thumbnail.getAttribute("title");

    viewerText.style.display = "none";
    largeImage.setAttribute("src", imageSrc);
    largeImageTitle.textContent = imageTitle;
}