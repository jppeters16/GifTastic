//Array of topics for buttons that are shown on initial loading of the page
var topics = ["Rock Climbing", "Soccer", "Football", "Baseball", "Volleyball", "Tennis", 
"Track & Field", "Swimming", "Field Hockey", "Lacrosse", "Rugby"];
//Max number of GIFs loaded in the "gif-container"
var numberOfGIFs = 10;
//Max rating of GIFs loaded in the "gif-container"
var maxRating = "PG";

//Rendering of each button listed in the "topics" array
function renderButtons(){
	for(var i = 0; i < topics.length; i++) {
        //create a new button variable and use jQuery to attach it to the html
        var newButton = $("<button>");
        //add new class of "btn" for bootstrap and rendering
        newButton.addClass("btn");
        //add additional class for css
        newButton.addClass("sports-button bg-primary text-light");
        //add text to the button based on the values of the topics listed in the array
        newButton.text(topics[i]);
        //append each button to the "button-container"
		$("#button-container").append(newButton);
    }
    //unbind the button so there isn't any weird interactions between different event handlers
	$(".sports-button").unbind("click");
    //"on-click" function
	$(".sports-button").on("click", function(){
		//unbind the button so there isn't any weird interactions between different event handlers
		$(".gif-image").unbind("click");
		//empty the container so that only the 10 GIFs from the most recent button click are displayed
		$("#gif-container").empty();
		populateGIFContainer($(this).text());
	});

}
//function to add buttons to "topics" array
function addButton(sport){
	if(topics.indexOf(sport) === -1) {
		//push the user's input into the "topics" array
		topics.push(sport);
		//empty the container to get rid of all the buttons
		$("#button-container").empty();
		//and rerender all the buttons to include the most recent button from user-input field
		renderButtons();
	}
}

function populateGIFContainer(sport){
	$.ajax({
		//"sport" is actually the users input called from the function above and represents an value entered into the text-box
		url: "https://api.giphy.com/v1/gifs/search?q=" + sport + 
		//calls maxRating and numberOfGIFs from the variables declared at the global scope
		"&api_key=jLEbiFCvur6lmIyIpOWpEIbwxleLbnEy&rating=" + maxRating + "&limit=" + numberOfGIFs,
		//we're using AJAX to retrieve so we use GET, because we want it right meow.
		method: "GET"
	//once everything is ready we run this function
	}).then(function(response){
		response.data.forEach(function(element){
			//new div
			var newDiv = $("<div>");
			//new class and container for the GIFs to go into with some bootstrap styling
			newDiv.addClass("individual-gif-container border border-primary rounded bg-light");
			//new variable for the GIFs request them in their "still" state at a fixed height of 200px.
			var newImage = $("<img src = '" + element.images.fixed_height_still.url + "'>");
			//new class for the gif images
			newImage.addClass("gif-image");
			//set the GIF's state to still
			newImage.attr("state", "still");
			//set attribute for the "still" state
			newImage.attr("still-data", element.images.fixed_height_still.url);
			//set attribute for the "animated" state
			newImage.attr("animated-data", element.images.fixed_height.url);
			//append the GIF
			newDiv.append(newImage);
			//append the rating of the GIF
			newDiv.append("<p>Rating: " + element.rating.toUpperCase() + "</p>");
			//append the GIF and Rating to the gif-container
			$("#gif-container").append(newDiv);
		});
		
		
		$(".gif-image").unbind("click");
		//if still, start moving; if moving, stand still.
		$(".gif-image").on("click", function(){
			if($(this).attr("state") === "still") {
				$(this).attr("state", "animated");
				$(this).attr("src", $(this).attr("animated-data"));
			}
			else {
				$(this).attr("state", "still");
				$(this).attr("src", $(this).attr("still-data"));
			}
		});
	});
}

//when the DOM is ready
$(document).ready(function(){
	renderButtons();
	//submit user-input
	$("#submit").on("click", function(){
		event.preventDefault();
		addButton($("#userInput").val().trim());
		$("#userInput").val("");
	});
});