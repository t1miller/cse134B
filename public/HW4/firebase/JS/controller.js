
function heroPortraitLookUp(heroName){
	baseDir = "HeroPortraits/";
	return baseDir+heroName+"Portrait.png";
}

//takes form data and pumps out a card template
function formToTemplate(formData){
	//hero card div
	var heroCardDiv = document.createElement("DIV");
	heroCardDiv.className = "hero-card";
	heroCardDiv.id = formData["hero"];

	//hero portrait div
	var heroPortraitDiv = document.createElement("DIV");
	heroPortraitDiv.className = "hero-portrait";
	heroPortraitDiv.innerHTML = "<img class=\"hero-image\" src=\""+heroPortraitLookUp(formData["hero"])+"\" alt=\""+formData["hero"]+" Portrait\">" //TODO

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
	userStatsDiv.innerHTML = "<h3 class=\"title\">Stats</h3>"+
        					 "<ul class=\"list-fields\">"+
                				"<li>Wins:</li>" +
                				"<li>Losses:</li>" +
			                    "<li>Win-rate:</li>" +
			                    "<li>Time Played:</li>" +
			                    "<li>Eliminations/Death:</li>" +
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
	updateStatsDB(hero);

	var updateForm = document.getElementById("update-stats-div");
	updateForm.remove();
}

function removeAllCards(){
	console.log("removeAllCards");
	//this assumes the cards are children of <body>
	var children = document.getElementsByClassName("hero-card");
	while(children.length > 0){
		children[0].parentNode.removeChild(children[0]);
	}
}
