/*
 * This file contains operations on the Firebase database.
 */

// Retrieve the user's favorite Heroes from the database and then display this 
// data using createHeroCard
function displayFavoritesDB() {
	var dict = {};
	var uid = firebase.auth().currentUser.uid;
	return firebase.database().ref("/users/" + uid + "/favorites/").once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				dict["hero"] = childSnapshot.key;
				dict["wins"] = childSnapshot.val().wins;
				dict["losses"] = childSnapshot.val().losses;
				dict["timePlayed"] = childSnapshot.val().timePlayed;
				dict["eliminations"] = childSnapshot.val().eliminations;
				dict["deaths"] = childSnapshot.val().deaths;
				createHeroCard(dict);
		});
	});
}

// 
function combineStatsDB(hero, updateStatsDict) {
	var combinedStats = {};
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref("/users/" + uid + "/favorites/").once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.key == hero) {
				combinedStats["hero"] = hero;
				combinedStats["wins"] = childSnapshot.val().wins + updateStatsDict["wins"];
			    combinedStats["losses"] = childSnapshot.val().losses + updateStatsDict["losses"];
			    combinedStats["timePlayed"] = childSnapshot.val().timePlayed + updateStatsDict["timePlayed"];
			    combinedStats["eliminations"] = childSnapshot.val().eliminations + updateStatsDict["eliminations"];
			    combinedStats["deaths"] = childSnapshot.val().deaths + updateStatsDict["deaths"];
			    updateStatsDB(hero, combinedStats);
			    createHeroCard(combinedStats,null)
			}
		});
	});
}

/*
function updateStatsFromDB(hero) {
	var newStats = {};
	var uid = firebase.auth().currentUser.uid;
	firebase.database().ref("/users/" + uid + "/favorites/").once("value").then(function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			if (childSnapshot.key == hero) {
				newStats["hero"] = hero;
				newStats["wins"] = childSnapshot.val().wins;
			    newStats["losses"] = childSnapshot.val().losses;
			    newStats["timePlayed"] = childSnapshot.val().timePlayed;
			    newStats["eliminations"] = childSnapshot.val().eliminations;
			    newStats["deaths"] = childSnapshot.val().deaths;
			    console.log(newStats);
			    createHeroCard(newStats);
			}
		});
	});
}
*/

function updateStatsDB(hero, updateStatsDict) {
	var user = firebase.auth().currentUser;

	// A post entry.
	var postData = {
		"wins": updateStatsDict["wins"],
		"losses": updateStatsDict["losses"],
		"timePlayed": updateStatsDict["timePlayed"],
		"eliminations": updateStatsDict["eliminations"],
		"deaths": updateStatsDict["deaths"]
	};

	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	updates['/users/' + user.uid + '/favorites/' + hero] = postData;
	return firebase.database().ref().update(updates);
	
}


function addHeroDB(hero) {
	// A post entry.
	var postData = {
		"wins": 0,
		"losses": 0,
		"timePlayed": 0,
		"eliminations": 0,
		"deaths": 0
	};

	// Write the new post's data simultaneously in the posts list and the user's post list.
	var updates = {};
	var uid = firebase.auth().currentUser.uid;
	updates["/users/" + uid + "/favorites/" + hero] = postData;
	return firebase.database().ref().update(updates);
}

function getStaticHeroInfoDB(hero){
	var heroInfo = {};
	firebase.database().ref("/staticHeroInfo/" + hero).once("value").then(function(snapshot) {
		heroInfo["health"] = snapshot.val().health;
		heroInfo["role"] = snapshot.val().role;
		heroInfo["ultimate"] = snapshot.val().ultimate;
		heroInfo["memberOfOverwatch"] = snapshot.val().memberOfOverwatch;
		heroInfo["origin"] = snapshot.val().origin;
		setStaticHero(heroInfo,hero);
	});
}




function deleteHero(hero) {
	document.getElementById(hero).remove();
	deleteHeroDB(hero);
}


function deleteHeroDB(hero) {
	var user = firebase.auth().currentUser;
	var updates = {};
	updates['/users/' + user.uid + '/favorites/' + hero] = null;
	return firebase.database().ref().update(updates);
}

