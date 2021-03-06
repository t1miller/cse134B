
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

    var edRatio = eliminations / deaths;
    if (isNaN(edRatio) || typeof edRatio == "undefined") {
        edRatio = 0;
    }
    else {
        edRatio = edRatio.toPrecision(3);
    }

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
                                    "<li><strong>Win-rate:</strong> <var class=\"win-rate-var\">"+winrate+"<var></li>" +
                                    "<li><strong>Time Played:</strong> "+timePlayed+"</li>" +
                                    "<li><strong>Eliminations/Death:</strong> "+edRatio+"</li>" +
                                 "</ul>" +
                                 "<div class=\"update-stats\">" +
                                     "<div class=\"material-button update-button\" onClick=\"createUpdateStatsForm('"+hero+"');\">" +
                                        "<p class=\"material-button-text\">Update</p>"+
                                     "</div>" +
                                     "<div class=\"material-button delete-button\" onClick=\"deleteHeroHandler('"+hero+"');\">" +
                                        "<p class=\"material-button-text\">Delete</p>"+
                                     "</div>" +
                                 "</div>";
        
        // Append all of the Hero card div's children
        heroCardDiv.appendChild(heroPortraitDiv);
        heroCardDiv.appendChild(backgroundInfoDiv);
        heroCardDiv.appendChild(userStatsDiv);

        // Prepend the Hero card to main
        var main = document.getElementsByTagName("MAIN")[0];
        main.insertBefore(heroCardDiv,main.firstChild)

        getStaticHeroInfoDB(hero);
    }
    else {
        // User stats div
        var userStatsDiv = document.getElementById("user-stats" + hero);
        userStatsDiv.className = "user-stats";
        userStatsDiv.id = "user-stats" + hero;
        
        userStatsDiv.innerHTML = "<h3 class=\"title\">Stats</h3>" +
                                 "<ul class=\"list-fields\">" +

                                    "<li><strong>Wins:</strong> "+wins+"</li>" +
                                    "<li><strong>Losses:</strong> "+losses+"</li>" +
                                    "<li id=\"win-rate\" ><strong>Win-rate:</strong> <var class=\"win-rate-var\">"+winrate+"<var></li>" +
                                    "<li><strong>Time Played:</strong> "+timePlayed+"</li>" +
                                    "<li><strong>Eliminations/Death:</strong> "+edRatio+"</li>" +
                                 "</ul>" +
                                  "<div class=\"update-stats\">" +
                                     "<div class=\"material-button update-button\" onClick=\"createUpdateStatsForm('"+hero+"');\">" +
                                        "<p class=\"material-button-text\">Update</p>"+
                                     "</div>" +
                                     "<div class=\"material-button delete-button\" onClick=\"deleteHeroHandler('"+hero+"');\">" +
                                        "<p class=\"material-button-text\">Delete</p>"+
                                     "</div>" +
                                 "</div>";

    }
    
}


// Add a hero to the favorites list
function addHero(hero) {
    var dict = {};
    dict["hero"] = hero;
    dict["wins"] = 0;
    dict["losses"] = 0;
    dict["timePlayed"] = 0;
    dict["eliminations"] = 0;
    dict["deaths"] = 0;

	// Only add the Hero if it is not already favorited
	if(document.getElementById(hero) == null){
		addHeroDB(dict["hero"]);
		createHeroCard(dict);
        document.getElementById('myModal').style.display = "none";
        body.style.overflow = "visible";
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
    updateStatsForm.innerHTML = "<h3 class=\"title\">Update</h3>"+
                                "<form id=\"update-stats-form\" action=\"#\">"+
                                    "<div class=\"update-stats-row\">"+
                                        "<strong>Games Won: </strong>"+                       
                                        "<div class=\"update-stats-box\"><input type=\"text\" class=\"update-stats-input\" name=\"gameswon\"></div>"+  
                                    "</div>"+

                                    "<div class=\"update-stats-row\">"+
                                        "<strong>Games Lost: </strong>"+                                    
                                        "<div class=\"update-stats-box\"><input type=\"text\" class=\"update-stats-input\" name=\"gameslost\"></div>"+
                                    "</div>"+

                                    "<div class=\"update-stats-row\">"+
                                        "<strong>Time Played: </strong>"+
                                        "<div class=\"update-stats-box\"><input type=\"text\" class=\"update-stats-input\" name=\"timeplayed\"></div>"+
                                    "</div>"+

                                    "<div class=\"update-stats-row\">"+
                                        "<strong>Eliminations: </strong>"+
                                        "<div class=\"update-stats-box\"><input type=\"text\" class=\"update-stats-input\" name=\"eliminations\"></div>"+
                                    "</div>"+

                                    "<div class=\"update-stats-row\">"+
                                        "<strong>Deaths: </strong>"+
                                        "<div class=\"update-stats-box\"><input type=\"text\" class=\"update-stats-input\" name=\"deaths\"></div>"+
                                    "</div>"+

                                    "<div id=\"submit-update-button\" class=\"material-button\" onClick=\"updateStatsHandler('"+hero+"')\">" +
                                        "<p class=\"material-button-text\">Submit</p>"+
                                     "</div>" +
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


// Display a dialog to confirm that the user wants to delete the hero
function deleteHeroHandler(hero) {
    if (window.confirm("Are you sure you want to delete " + hero + "? All personal stats on this hero will be lost forever.")) { 
        deleteHero(hero);
    }
}


// Delete a heo
function deleteHero(hero) {
	document.getElementById(hero).remove();
	deleteHeroDB(hero);
}


// Remove all hero cards
function removeAllCards(){
    // This assumes the cards are children of <body>
    var children = document.getElementsByClassName("hero-card");
    while (children.length > 0) {
        children[0].parentNode.removeChild(children[0]);
    }
}
        
function sortAtoZ(){
    //get all children
    var cards = document.getElementsByClassName("hero-card");
    var main = document.getElementsByTagName("MAIN")[0];
    
    heroName = [];
    cardCopy = [];//store a copy of cards

    for(var i = 0; i < cards.length; i++){
        heroName.push(cards[i].id+"_"+i);
        cardCopy[i] = cards[i]
    }

    heroName.sort();
    removeAllCards();

    for(var i = 0; i < cardCopy.length; i++){
        index = heroName[i].split("_")[1]
        main.appendChild(cardCopy[index]);
    }

}

function sortWinRate(){
    var cards = document.getElementsByClassName("hero-card");
    var main = document.getElementsByTagName("MAIN")[0];
    
    winRate = [];
    cardCopy = [];//store a copy of cards
    var winRateVar = document.getElementsByClassName("win-rate-var");
    for(var i = 0; i < cards.length; i++){
        winRate.push(winRateVar[i].textContent+"_"+i);
        cardCopy[i] = cards[i];
    }

    //sort decreasing order
    winRate.sort(function(a, b) {
      var num1 = a.split("_")[0];
      var num2 = b.split("_")[0];
      return num2 - num1;
    });
    removeAllCards();
    for(var i = 0; i < cardCopy.length; i++){
        index = winRate[i].split("_")[1]
        main.appendChild(cardCopy[index]);
    }
}

function sortWins(){
    
}

function sort(){
    var sortSelector = document.getElementById("sort-selector");
    var sortType = sortSelector.options[sortSelector.selectedIndex].value;

    if (sortType == "alphabetical"){
        sortAtoZ();
    }else if (sortType == "winrate"){
        sortWinRate();
    }
}


