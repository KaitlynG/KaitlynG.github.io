"use strict";
window.onload = init;

function init(){
    //Fetch menu items on load
    loadBreeds(); 
    
    //Hook up the mobile menu button
    document.querySelector(".mobile-menu").onclick = function() {
        document.querySelector("#pull-out-menu").classList.toggle("active");
    };

    //Hook up the search bar (searches when you hit Enter)
    document.querySelector(".search-bar").addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            let term = this.value.trim().toLowerCase();
            //if(term.includes(" ")){
            //    let firstHalf = term.substring(0, term.indexOf(" "));
            //    let secondHalf = term.substring(term.indexOf(" ") + 1);
            //    term = firstHalf + " " + secondHalf;
            //}

            if(term) searchBreed(term);
        }
    });

    //Hook up the Random button
    document.querySelector(".random-breed").onclick = fetchRandom;
}

// Fetch all breeds for the drop-down menu
function loadBreeds() {
    let xhr = new XMLHttpRequest();
    xhr.onload = function(e) {
        let obj = JSON.parse(e.target.responseText);
        let menuHtml = "";
        
        for (let breed in obj.message) {
            let subBreeds = obj.message[breed];
            if (subBreeds.length > 0) {
                menuHtml += `
                <li>
                    <details>
                        <summary onhover="searchBreed('${breed}')">${breed} ▾</summary>
                        <ul class="sub-menu">`;
                for(let i=0; i < subBreeds.length; i++) {
                    menuHtml += `<li onclick="searchBreed('${breed}/${subBreeds[i]}')">${subBreeds[i]} ${breed}</li>`;
                }
                menuHtml += `</ul></details></li>`;
            } else {
                menuHtml += `<li class="single-breed" onclick="searchBreed('${breed}')">${breed}</li>`;
            }
        }
        document.querySelector("#breed-list").innerHTML = menuHtml;
    };
    xhr.open("GET", "https://dog.ceo/api/breeds/list/all");
    xhr.send();
}

// Search a specific breed
function searchBreed(breedPath){
    document.querySelector("#pull-out-menu").classList.remove("active");
    breedPath = breedPath.replace(" ", "/"); 
    
    const url = "https://dog.ceo/api/breed/" + breedPath + "/images";
    document.querySelector("#status").innerHTML = `Showing results for: <b>${breedPath.replace("/"," ")}</b>`;
    
    fetchImages(url);
}

// Fetch completely random dog images
function fetchRandom() {
    document.querySelector("#status").innerHTML = `Showing random dogs!`;
    fetchImages("https://dog.ceo/api/breeds/image/random/12", "Random Dog");
}

// Helper function to process the API request
function fetchImages(url) {
    let xhr = new XMLHttpRequest();

    // Pass the label to dataLoaded so it can display the text under the image
    xhr.onload = function(e) { dataLoaded(e); };
    xhr.onerror = function() {
        document.querySelector("#content").innerHTML = "<p><i>Network error occurred.</i></p>";
    };
    xhr.open("GET", url);
    xhr.send();
}

// Display the results
function dataLoaded(e){
    let xhr = e.target;
    let obj = JSON.parse(xhr.responseText);
    
    // If the breed isn't found, the API returns a status of "error"
    if(obj.status != "success"){
        document.querySelector("#content").innerHTML = `<p><i>There was a problem! (Breed not found)</i></p>`;
        return; 
    }
    
    let results = obj.message;

    if(!results || results.length == 0){
        document.querySelector("#content").innerHTML = "<b>No results found.</b>";
        return;
    }

    let bigString = "";
    
    // Ensure results is an array (the random endpoint sometimes returns a single string)
    if (typeof results === "string") results = [results];

    // Cap the loops at 20 so the grid doesn't crash on huge requests
    let maxLoops = results.length < 20 ? results.length : 20; 

    // Loop through results and build the HTML
    for(let i=0; i < maxLoops; i++){
        let imgUrl = results[i];
        
        bigString += `
            <div class="result">
                <img src="${imgUrl}" alt="Dog Image" loading="lazy" />
            </div>`;
    }
    
    document.querySelector("#content").innerHTML = bigString;
}