// 1
  	window.onload = (e) => {document.querySelector("#search").onclick = searchButtonClicked};
	
	// 2
	let displayTerm = "";
	
	// 3
	function searchButtonClicked(){
		console.log("searchButtonClicked() called");
		
        const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";

        let GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

        //build url string
        let url = GIPHY_URL;
        url += "api_key=" + GIPHY_KEY;

        //parse the term inputted by the user that is intended to be searched
        let term = document.querySelector("#searchterm").value;
        displayTerm = term;

        //Get rid of any leading and trailing spacess
        term = term.trim();

        //encode sspaces and special characters
        term = encodeURIComponent(term);

        //If there is no search term, bail out of the function
        if(term.length < 1) return;
        
        //append the search term to the url
        url += "&q=" + term;

        //Grab the user search limit from the <select> and add to url
        let limit = document.querySelector("#limit").value;
        url += "&limit=" + limit;

        //Update the UI
        document.querySelector("#status").innerHTML = "<b>Searching for '" + displayTerm + "'</b>";

        //print url to console
        console.log(url);

        //request data
        getData(url);

	}

    function getData(url){
        //Create a new XHR object
        let xhr = new XMLHttpRequest();

        //set the onload handler
        xhr.onload = dataLoaded;

        //set the onerror handler
        xhr.onerror = dataError;

        //Open connection and send the request
        xhr.open("GET", url);
        xhr.send();
    }
	
    //Callback functions

    function dataLoaded(e){
        //event.target is the xhr object
        let xhr = e.target;

        //xhr.responseText is the JSON file just downloaded
        console.log(xhr.responseText);

        //turn the text into a parsable JavaScript object
        let obj = JSON.parse(xhr.responseText);

        //if there are no results, print a message and bail out of the function
        if(!obj.data || obj.data.length == 0){
            document.querySelector("#status").innerHTML = "<b>No results found for '" + displayTerm + "'</b>";
            return;
        }

        //Start building the html string to display results to the user
        let results = obj.data;
        console.log("results.length = " + results.length);
        let bigString = "";

        //loop through the array of reults
        for(let i=0; i<results.length; i++){
            let result = results[i];

            //get the URL to the GIF
            let smallURL = result.images.fixed_width_downsampled.url;
            if(!smallURL) smallURL = "images/no-image-found.png";

            //Get the URL to the GIPHY Page
            let url = result.url;
            
            //get rating
            let rating = (result.rating ? result.rating : "NA").toUpperCase();

            //Build <div> to hold each result
            var line = "<div class='result'>";
                line += "<img src='";
                line += smallURL;
                line += "' title='";
                line += result.id;
                line += "' />";

                line += "<span><a target='_blank' href='" + url + "'>View on Giphy</a>";
                line += "<p>Rating: " + rating + "</p></span>";
                line += "</div>";

            //add the <div> to bigString and loop
            bigString += line;
        }

        //show to user
        document.querySelector("#content").innerHTML = bigString;

        //update the status
        document.querySelector("#status").innerHTML = "<b>Success!</b><p><i> Here are " + results.length + " results for '" + displayTerm + "'</i></p>";;
    }

    function dataError(e){
        console.log("An error occurred");
    }