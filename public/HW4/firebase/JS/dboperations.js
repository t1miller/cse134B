function displayFavoritesDB(){
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
			    formToTemplate(dict);
		});
	});
}

function getFavoritesDB(){
	var favorites = {};
	var uid = firebase.auth().currentUser.uid;
	return firebase.database().ref("/users/" + uid + "/favorites/").once("value").then(function(snapshot) {
			snapshot.forEach(function(childSnapshot) {
				var heroInfo = {};
				var heroName = childSnapshot.key;
			    heroInfo["wins"] = childSnapshot.val().wins;
			    heroInfo["losses"] = childSnapshot.val().losses;
			    heroInfo["timePlayed"] = childSnapshot.val().timePlayed;
			    heroInfo["eliminations"] = childSnapshot.val().eliminations;
			    heroInfo["deaths"] = childSnapshot.val().deaths;
			    favorites[heroName] = heroInfo;

		});
	});
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