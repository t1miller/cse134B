
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
    var overwatchMember = "Yes";
    if (!staticHeroInfo["memberOfOverwatch"]) {
        overwatchMember = "No";
    }
    staticHeroDiv.innerHTML = "<h3 class=\"title\">"+heroName+"</h3>"+
	                              "<ul class=\"list-fields\">"+
	                                  "<li><strong>Origin: </strong>"+staticHeroInfo["origin"]+"</li>"+
	                                  "<li><strong>Role: </strong>"+staticHeroInfo["role"]+"</li>"+
	                                  "<li><strong>Health: </strong>"+staticHeroInfo["health"]+"</li>"+
	                                  "<li><strong>Ultimate: </strong>"+staticHeroInfo["ultimate"]+"</li>"+
	                                  "<li><strong>Overwatch Member: </strong>"+overwatchMember+"</li>"+
	                              "</ul>"; 
                  
}


// Takes form data and pumps out a card template
function createHeroCard(userStatsDict) {

    var hero = userStatsDict["hero"];
    var wins = parseInt(userStatsDict["wins"], 10);
    var losses = parseInt(userStatsDict["losses"], 10);
    var timePlayed = parseInt(userStatsDict["timePlayed"], 10);
    var eliminations = parseInt(userStatsDict["eliminations"], 10);
    var deaths = parseInt(userStatsDict["deaths"], 10);

    var winrate = wins / (wins+losses);
    if (isNaN(winrate) || typeof winrate == "undefined") {
        winrate = 0;
    }
    else {
        winrate = winrate.toPrecision(3);
    }
    console.log(hero + winrate);


    var edRatio = eliminations / deaths;
    if (isNaN(edRatio) || typeof edRatio == "undefined") {
        edRatio = 0;
    }
    else {
        edRatio = edRatio.toPrecision(3);
    }
    console.log(hero + edRatio);

    var existingHeroCard = document.getElementById(hero);
    if (existingHeroCard == null) {
        // Hero card div
        var heroCardDiv = document.createElement("DIV");
        heroCardDiv.className = "hero-card";
        heroCardDiv.id = userStatsDict["hero"];

        // Hero portrait div
        var heroPortraitDiv = document.createElement("DIV");
        heroPortraitDiv.className = "hero-portrait";
        heroPortraitDiv.innerHTML = "<img class=\"hero-image\" src=\""+heroPortraitLookUp(hero)+"\" alt=\""+hero+"\">"

        // Hero background info div
        var backgroundInfoDiv = document.createElement("DIV");
        backgroundInfoDiv.className = "background-info";
        backgroundInfoDiv.id = "static-hero-info"+hero;
        /*
        backgroundInfoDiv.innerHTML =   "<h3 class=\"title\">"+hero+"</h3>"+
                                        "<ul class=\"list-fields\">"+
                                            "<li><strong>Origin:</strong> </li>"+
                                            "<li><strong>Role:</strong> </li>"+
                                            "<li><strong>Health:</strong> </li>"+
                                            "<li><strong>Ultimate:</strong> </li>"+
                                            "<li><strong>Overwatch Member:</strong> </li>"+
                                        "</ul>";    
        */
                           

        // User stats div
        var userStatsDiv = document.createElement("DIV");
        userStatsDiv.className = "user-stats";
        userStatsDiv.id = "user-stats" + hero;
        
        userStatsDiv.innerHTML = "<h3 class=\"title\">Stats</h3>"+
                                 "<ul class=\"list-fields\">"+
                                    "<li><strong>Wins:</strong> "+wins+"</li>" +
                                    "<li><strong>Losses:</strong> "+losses+"</li>" +
                                    "<li><strong>Win-rate:</strong> "+winrate+"</li>" +
                                    "<li><strong>Time Played:</strong> "+timePlayed+"</li>" +
                                    "<li><strong>Eliminations/Death:</strong> "+edRatio+"</li>" +
                                 "</ul>" +
                                 "<form class=\"update-stats\" action=\"#\">"+
                                    "<input type=\"button\" value=\"Edit\" onClick=\"createUpdateStatsForm('"+hero+"');\">" +
                                    "<input type=\"button\" value=\"Delete\" onClick=\"deleteHero('"+hero+"');\">" +
                                 "</form>";
        
        // Append all of the Hero card div's children
        heroCardDiv.appendChild(heroPortraitDiv);
        heroCardDiv.appendChild(backgroundInfoDiv);
        heroCardDiv.appendChild(userStatsDiv);

        // Append the Hero card to the body
        document.getElementsByTagName("MAIN")[0].appendChild(heroCardDiv);
        getStaticHeroInfoDB(hero);
    }
    else {
        // User stats div
        var userStatsDiv = document.getElementById("user-stats" + hero);
        userStatsDiv.className = "user-stats";
        userStatsDiv.id = "user-stats" + hero;
        
        userStatsDiv.innerHTML = "<h3 class=\"title\">Stats</h3>"+
                                 "<ul class=\"list-fields\">"+
                                    "<li>Wins: "+wins+"</li>" +
                                    "<li>Losses: "+losses+"</li>" +
                                    "<li>Win-rate: "+winrate+"</li>" +
                                    "<li>Time Played: "+timePlayed+"</li>" +
                                    "<li>Eliminations/Death: "+edRatio+"</li>" +
                                 "</ul>" +
                                 "<form class=\"update-stats\" action=\"#\">"+
                                    "<input type=\"button\" value=\"Edit\" onClick=\"createUpdateStatsForm('"+hero+"');\">" +
                                    "<input type=\"button\" value=\"Delete\" onClick=\"deleteHero('"+hero+"');\">" +
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
