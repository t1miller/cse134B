
function heroPortraitLookUp(heroName){
        baseDir = "HeroPortraits/";
        return baseDir+heroName+"Portrait.png";
    }

//takes form data and pumps out a card template
function formToTemplate(formData){

    var existingHeroCard = document.getElementById(formData["hero"]);
    
    if (existingHeroCard == null) {
        //hero card div
        var heroCardDiv = document.createElement("DIV");
        heroCardDiv.className = "hero-card";
        heroCardDiv.id = formData["hero"];

        //hero portrait div
        var heroPortraitDiv = document.createElement("DIV");
        heroPortraitDiv.className = "hero-portrait";
        heroPortraitDiv.innerHTML = "<img class=\"hero-image\" src=\""+heroPortraitLookUp(formData["hero"])+"\" alt=\"Hanzo Portrait\">" //TODO

        //hero background info div
        var backgroundInfoDiv = document.createElement("DIV");
        backgroundInfoDiv.className = "background-info";
        backgroundInfoDiv.innerHTML = "<h3 class=\"title\">"+formData["hero"]+"</h3>"+
                                        "<ul class=\"list-fields\">"+
                                            "<li>Origin:</li>"+
                                            "<li>Role:</li>"+
                                            "<li>Health:</li>"+
                                            "<li>Ultimate:</li>"+
                                            "<li>Member of Overwatch:</li>"+
                                        "</ul>";                        

        //user stats div
        var userStatsDiv = document.createElement("DIV");
        userStatsDiv.className = "user-stats";
        userStatsDiv.id = "user-stats" + formData["hero"];
        var winrate = formData["wins"] / formData["losses"];
        var edRatio = formData["eliminations"] / formData["deaths"];
        userStatsDiv.innerHTML = "<h3 class=\"title\">Stats</h3>"+
                                 "<ul class=\"list-fields\">"+
                                    "<li>Wins: "+formData["wins"]+"</li>" +
                                    "<li>Losses: "+formData["losses"]+"</li>" +
                                    "<li>Win-rate: "+winrate+"</li>" +
                                    "<li>Time Played: "+formData["timePlayed"]+"</li>" +
                                    "<li>Eliminations/Death: "+edRatio+"</li>" +
                                 "</ul>" +
                                 "<form class=\"update-stats\" action=\"#\">"+
                                    "<input type=\"button\" value=\"Edit\" onClick=\"updateStats('"+formData["hero"]+"');\">" +
                                    "<input type=\"button\" value=\"Delete\" onClick=\"deleteHero('"+formData["hero"]+"');\">" +
                                 "</form>";
        
        //append all of hero card div's children
        heroCardDiv.appendChild(heroPortraitDiv);
        heroCardDiv.appendChild(backgroundInfoDiv);
        heroCardDiv.appendChild(userStatsDiv);
        
        document.getElementsByTagName("BODY")[0].appendChild(heroCardDiv);
    }
    else {
        //user stats div
        var userStatsDiv = document.getElementById("user-stats" + formData["hero"]);
        userStatsDiv.className = "user-stats";
        userStatsDiv.id = "user-stats" + formData["hero"];
        var winrate = formData["wins"] / formData["losses"];
        var edRatio = formData["eliminations"] / formData["deaths"];
        userStatsDiv.innerHTML = "<h3 class=\"title\">Stats</h3>"+
                                 "<ul class=\"list-fields\">"+
                                    "<li>Wins: "+formData["wins"]+"</li>" +
                                    "<li>Losses: "+formData["losses"]+"</li>" +
                                    "<li>Win-rate: "+winrate+"</li>" +
                                    "<li>Time Played: "+formData["timePlayed"]+"</li>" +
                                    "<li>Eliminations/Death: "+edRatio+"</li>" +
                                 "</ul>" +
                                 "<form class=\"update-stats\" action=\"#\">"+
                                    "<input type=\"button\" value=\"Edit\" onClick=\"updateStats('"+formData["hero"]+"');\">" +
                                    "<input type=\"button\" value=\"Delete\" onClick=\"deleteHero('"+formData["hero"]+"');\">" +
                                 "</form>";

    }
    
}

function updateStats(hero) {
    var updateForm = document.getElementById("update-stats-div");
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

function updateStatsHandler(hero) {
	var wins = document.getElementById("update-stats-form").elements["gameswon"].value;
	var losses = document.getElementById("update-stats-form").elements["gameslost"].value;
	var timeplayed = document.getElementById("update-stats-form").elements["timeplayed"].value;
	var eliminations = document.getElementById("update-stats-form").elements["eliminations"].value;
	var deaths = document.getElementById("update-stats-form").elements["deaths"].value;

	if (wins == "" || losses == "" || timeplayed == "" || eliminations == "" || deaths == "") {
		return;
	}

	/*
	var favoritesDict = {};
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref("/users/" + uid + "/favorites/").once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var heroInfo = {};
			var heroName = childSnapshot.key;
		    heroInfo["wins"] = childSnapshot.val().wins;
		    heroInfo["losses"] = childSnapshot.val().losses;
		    heroInfo["timePlayed"] = childSnapshot.val().timePlayed;
		    heroInfo["eliminations"] = childSnapshot.val().eliminations;
		    heroInfo["deaths"] = childSnapshot.val().deaths;
		    favoritesDict[heroName] = heroInfo;
		});
	});
	console.log(favoritesDict);
	console.log(favoritesDict);
	console.log(favoritesDict["Lucio"]);
	*/
	getFavoritesHeroDB(hero);
	//console.log(JSON.stringify(faves));
	//console.log(getFavoritesDB(hero)["deaths"]);
	//console.log(faves["deaths"]);


	var updateStatsDict = {};
	updateStatsDict["wins"] = parseInt(wins, 10);
	updateStatsDict["losses"] = parseInt(losses, 10);
	updateStatsDict["timePlayed"] = parseInt(timeplayed, 10);
	updateStatsDict["eliminations"] = parseInt(eliminations, 10);
	updateStatsDict["deaths"] = parseInt(deaths, 10);
    updateStatsDB(hero, updateStatsDict);

    var updateForm = document.getElementById("update-stats-div");
    updateForm.remove();

    //updateStatsDict["hero"] = hero;
    //formToTemplate(updateStatsDict);
    //console.log("here");
    //var favoritesDict = getFavoritesDB();

}

function removeAllCards(){
    console.log("removeAllCards");
    //this assumes the cards are children of <body>
    var children = document.getElementsByClassName("hero-card");
    while(children.length > 0){
        children[0].parentNode.removeChild(children[0]);
    }
}
