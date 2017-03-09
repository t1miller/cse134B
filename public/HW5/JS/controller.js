
/*
 * This file contains functions related to controlling the DOM and interacting 
 * with the Firebase database.  It extracts user input from the DOM and then 
 * passes this information to the database.  It also returns responses from 
 * the database and displays it on the DOM.
 */


// Return the Hero's portrait based on heroName
function heroPortraitLookUp(heroName) {
	baseDir = "HeroPortraits/";
	return baseDir+heroName+"Portrait.png";
}


// Set the data for one static hero based on data in the staticHeroInfo 
// dictionary
function setStaticHero(staticHeroInfo, heroName) {
    var staticHeroDiv = document.getElementById("static-hero-info"+heroName);
    staticHeroDiv.innerHTML = "<h3 class=\"title\">"+heroName+"</h3>"+
	                              "<ul class=\"list-fields\">"+
	                                  "<li>Origin: "+staticHeroInfo["origin"]+"</li>"+
	                                  "<li>Role: "+staticHeroInfo["role"]+"</li>"+
	                                  "<li>Health: "+staticHeroInfo["health"]+"</li>"+
	                                  "<li>Ultimate: "+staticHeroInfo["ultimate"]+"</li>"+
	                                  "<li>Member of Overwatch: "+staticHeroInfo["memberOfOverwatch"]+"</li>"+
	                              "</ul>"; 
                  
}


// Takes form data and pumps out a card template
function createHeroCard(formData) {

    var existingHeroCard = document.getElementById(formData["hero"]);
    
    if (existingHeroCard == null) {
        // Hero card div
        var heroCardDiv = document.createElement("DIV");
        heroCardDiv.className = "hero-card";
        heroCardDiv.id = formData["hero"];

        // Hero portrait div
        var heroPortraitDiv = document.createElement("DIV");
        heroPortraitDiv.className = "hero-portrait";
        heroPortraitDiv.innerHTML = "<img class=\"hero-image\" src=\""+heroPortraitLookUp(formData["hero"])+"\" alt=\""+formData["hero"]+"\">"

        // Hero background info div
        var backgroundInfoDiv = document.createElement("DIV");
        backgroundInfoDiv.className = "background-info";
        backgroundInfoDiv.id = "static-hero-info"+formData["hero"];
        backgroundInfoDiv.innerHTML =   "<h3 class=\"title\">"+formData["hero"]+"</h3>"+
                                        "<ul class=\"list-fields\">"+
                                            "<li>Origin:</li>"+
                                            "<li>Role:</li>"+
                                            "<li>Health:</li>"+
                                            "<li>Ultimate:</li>"+
                                            "<li>Member of Overwatch:</li>"+
                                        "</ul>";    
                           

        // User stats div
        var userStatsDiv = document.createElement("DIV");
        userStatsDiv.className = "user-stats";
        userStatsDiv.id = "user-stats" + formData["hero"];
        var winrate = formData["wins"] / (formData["wins"] + formData["losses"]);
        if (isNaN(winrate) || typeof winrate == "undefined") {
        	winrate = 0;
        }
        var edRatio = formData["eliminations"] / formData["deaths"];
        if (isNaN(edRatio) || typeof edRatio == "undefined") {
        	edRatio = 0;
        }
        userStatsDiv.innerHTML = "<h3 class=\"title\">Stats</h3>"+
                                 "<ul class=\"list-fields\">"+
                                    "<li>Wins: "+formData["wins"]+"</li>" +
                                    "<li>Losses: "+formData["losses"]+"</li>" +
                                    "<li>Win-rate: "+winrate+"</li>" +
                                    "<li>Time Played: "+formData["timePlayed"]+"</li>" +
                                    "<li>Eliminations/Death: "+edRatio+"</li>" +
                                 "</ul>" +
                                 "<form class=\"update-stats\" action=\"#\">"+
                                    "<input type=\"button\" value=\"Edit\" onClick=\"createUpdateStatsForm('"+formData["hero"]+"');\">" +
                                    "<input type=\"button\" value=\"Delete\" onClick=\"deleteHero('"+formData["hero"]+"');\">" +
                                 "</form>";
        
        // Append all of the Hero card div's children
        heroCardDiv.appendChild(heroPortraitDiv);
        heroCardDiv.appendChild(backgroundInfoDiv);
        heroCardDiv.appendChild(userStatsDiv);

        // Append the Hero card to the body
        document.getElementsByTagName("BODY")[0].appendChild(heroCardDiv);
        getStaticHeroInfoDB(formData["hero"]);
    }
    else {
        // User stats div
        var userStatsDiv = document.getElementById("user-stats" + formData["hero"]);
        userStatsDiv.className = "user-stats";
        userStatsDiv.id = "user-stats" + formData["hero"];
        var winrate = formData["wins"] / (formData["wins"] + formData["losses"]);
        if (isNaN(winrate) || typeof winrate == "undefined") {
        	winrate = 0;
        }
        var edRatio = formData["eliminations"] / formData["deaths"];
        if (isNaN(edRatio) || typeof edRatio == "undefined") {
        	edRatio = 0;
        }
        userStatsDiv.innerHTML = "<h3 class=\"title\">Stats</h3>"+
                                 "<ul class=\"list-fields\">"+
                                    "<li>Wins: "+formData["wins"]+"</li>" +
                                    "<li>Losses: "+formData["losses"]+"</li>" +
                                    "<li>Win-rate: "+winrate+"</li>" +
                                    "<li>Time Played: "+formData["timePlayed"]+"</li>" +
                                    "<li>Eliminations/Death: "+edRatio+"</li>" +
                                 "</ul>" +
                                 "<form class=\"update-stats\" action=\"#\">"+
                                    "<input type=\"button\" value=\"Edit\" onClick=\"createUpdateStatsForm('"+formData["hero"]+"');\">" +
                                    "<input type=\"button\" value=\"Delete\" onClick=\"deleteHero('"+formData["hero"]+"');\">" +
                                 "</form>";

    }
    
}


// Add a hero to the favorites list
function addHero() {
	var dict = {};
	dict["hero"] = document.getElementById("addHeroForm").elements["hero"].value;
	dict["wins"] = 0;
	dict["losses"] = 0;
	dict["timePlayed"] = 0;
	dict["eliminations"] = 0;
	dict["deaths"] = 0;

	// Make sure the user has selected a Hero
	if(dict["hero"] == "") {
		alert("Please select a hero");
		return;
	}

	// Only add the Hero if it is not already favorited
	if(document.getElementById(dict["hero"]) == null){
		addHeroDB(dict["hero"]);
		createHeroCard(dict);
	}
	else {
		alert("Hero already exists.");
	}
}


// Create a new update stats form for hero
function createUpdateStatsForm(hero) {
    var updateForm = document.getElementById("update-stats-div");
    // Remove the old update form if it exists
    if (updateForm != null) {
        updateForm.remove();
    }

    var updateStatsForm = document.createElement("DIV");
    updateStatsForm.id = "update-stats-div"
    updateStatsForm.innerHTML = "<form id=\"update-stats-form\" action=\"#\">"+
                                    "Games Won:"+
                                    "<input type=\"text\" name=\"gameswon\"><br>"+
                                    "Games Lost:"+
                                    "<input type=\"text\" name=\"gameslost\"><br>"+
                                    "Time Played:"+
                                    "<input type=\"text\" name=\"timeplayed\"><br>"+
                                    "Eliminations:"+
                                    "<input type=\"text\" name=\"eliminations\"><br>"+
                                    "Deaths:"+
                                    "<input type=\"text\" name=\"deaths\"><br>"+
                                    "<input type=\"button\" value=\"submit-update\" onClick=\"updateStatsHandler('"+hero+"')\">"+
                                "</form>";
    document.getElementById(hero).appendChild(updateStatsForm);
}


// Extract the user input from the update form and update the database with 
// these values
function updateStatsHandler(hero) {
	var wins = document.getElementById("update-stats-form").elements["gameswon"].value;
	var losses = document.getElementById("update-stats-form").elements["gameslost"].value;
	var timeplayed = document.getElementById("update-stats-form").elements["timeplayed"].value;
	var eliminations = document.getElementById("update-stats-form").elements["eliminations"].value;
	var deaths = document.getElementById("update-stats-form").elements["deaths"].value;

	// Form was not entirely filled
	if (wins == "" || losses == "" || timeplayed == "" || eliminations == "" || deaths == "") {
		return;
	}

	var updateStatsDict = {};
	updateStatsDict["wins"] = parseInt(wins, 10);
	updateStatsDict["losses"] = parseInt(losses, 10);
	updateStatsDict["timePlayed"] = parseInt(timeplayed, 10);
	updateStatsDict["eliminations"] = parseInt(eliminations, 10);
	updateStatsDict["deaths"] = parseInt(deaths, 10);

    combineStatsDB(hero, updateStatsDict);

    var updateForm = document.getElementById("update-stats-div");
    updateForm.remove();
}


// Delete a heo
function deleteHero(hero) {
	document.getElementById(hero).remove();
	deleteHeroDB(hero);
}


// Remove all hero cards
function removeAllCards(){
    console.log("removeAllCards");
    // This assumes the cards are children of <body>
    var children = document.getElementsByClassName("hero-card");
    while (children.length > 0) {
        children[0].parentNode.removeChild(children[0]);
    }
}
