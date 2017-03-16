function heroPortraitLookUp(a){return baseDir="HeroPortraits/",baseDir+a+"Portrait.png"}function setStaticHero(a,b){var c=document.getElementById("static-hero-info"+b),d="Yes";a.memberOfOverwatch||(d="No"),c.innerHTML='<h3 class="title">'+b+'</h3><ul class="list-fields"><li><strong>Origin: </strong>'+a.origin+"</li><li><strong>Role: </strong>"+a.role+"</li><li><strong>Health: </strong>"+a.health+"</li><li><strong>Ultimate: </strong>"+a.ultimate+"</li><li><strong>Overwatch Member: </strong>"+d+"</li></ul>"}function createHeroCard(a){var b=a.hero,c=parseInt(a.wins,10),d=parseInt(a.losses,10),e=parseInt(a.timePlayed,10),f=parseInt(a.eliminations,10),g=parseInt(a.deaths,10),h=c/(c+d);h=isNaN(h)||"undefined"==typeof h?0:h.toPrecision(3);var i=f/g;i=isNaN(i)||"undefined"==typeof i?0:i.toPrecision(3);var j=document.getElementById(b);if(null==j){var k=document.createElement("DIV");k.className="hero-card",k.id=a.hero;var l=document.createElement("DIV");l.className="hero-portrait",l.innerHTML='<img class="hero-image" src="'+heroPortraitLookUp(b)+'" alt="'+b+'">';var m=document.createElement("DIV");m.className="background-info",m.id="static-hero-info"+b;var n=document.createElement("DIV");n.className="user-stats",n.id="user-stats"+b,n.innerHTML='<h3 class="title">Stats</h3><ul class="list-fields"><li><strong>Wins:</strong> '+c+"</li><li><strong>Losses:</strong> "+d+'</li><li><strong>Win-rate:</strong> <var class="win-rate-var">'+h+"<var></li><li><strong>Time Played:</strong> "+e+"</li><li><strong>Eliminations/Death:</strong> "+i+'</li></ul><div class="update-stats"><div class="material-button update-button" onClick="createUpdateStatsForm(\''+b+'\');"><p class="material-button-text">Update</p></div><div class="material-button delete-button" onClick="deleteHeroHandler(\''+b+'\');"><p class="material-button-text">Delete</p></div></div>',k.appendChild(l),k.appendChild(m),k.appendChild(n);var o=document.getElementsByTagName("MAIN")[0];o.insertBefore(k,o.firstChild),getStaticHeroInfoDB(b)}else{var n=document.getElementById("user-stats"+b);n.className="user-stats",n.id="user-stats"+b,n.innerHTML='<h3 class="title">Stats</h3><ul class="list-fields"><li><strong>Wins:</strong> '+c+"</li><li><strong>Losses:</strong> "+d+'</li><li id="win-rate" ><strong>Win-rate:</strong> <var class="win-rate-var">'+h+"<var></li><li><strong>Time Played:</strong> "+e+"</li><li><strong>Eliminations/Death:</strong> "+i+'</li></ul><div class="update-stats"><div class="material-button update-button" onClick="createUpdateStatsForm(\''+b+'\');"><p class="material-button-text">Update</p></div><div class="material-button delete-button" onClick="deleteHeroHandler(\''+b+'\');"><p class="material-button-text">Delete</p></div></div>'}}function addHero(a){var b={};b.hero=a,b.wins=0,b.losses=0,b.timePlayed=0,b.eliminations=0,b.deaths=0,null==document.getElementById(a)?(addHeroDB(b.hero),createHeroCard(b),document.getElementById("myModal").style.display="none",body.style.overflow="visible"):alert("Hero already exists.")}function createUpdateStatsForm(a){var b=document.getElementById("update-stats-div");null!=b&&b.remove();var c=document.createElement("DIV");c.id="update-stats-div",c.innerHTML='<h3 class="title">Update</h3><form id="update-stats-form" action="#"><div class="update-stats-row"><strong>Games Won: </strong><div class="update-stats-box"><input type="text" class="update-stats-input" name="gameswon"></div></div><div class="update-stats-row"><strong>Games Lost: </strong><div class="update-stats-box"><input type="text" class="update-stats-input" name="gameslost"></div></div><div class="update-stats-row"><strong>Time Played: </strong><div class="update-stats-box"><input type="text" class="update-stats-input" name="timeplayed"></div></div><div class="update-stats-row"><strong>Eliminations: </strong><div class="update-stats-box"><input type="text" class="update-stats-input" name="eliminations"></div></div><div class="update-stats-row"><strong>Deaths: </strong><div class="update-stats-box"><input type="text" class="update-stats-input" name="deaths"></div></div><div id="submit-update-button" class="material-button" onClick="updateStatsHandler(\''+a+'\')"><p class="material-button-text">Submit</p></div></form>',document.getElementById(a).appendChild(c)}function updateStatsHandler(a){var b=document.getElementById("update-stats-form").elements.gameswon.value,c=document.getElementById("update-stats-form").elements.gameslost.value,d=document.getElementById("update-stats-form").elements.timeplayed.value,e=document.getElementById("update-stats-form").elements.eliminations.value,f=document.getElementById("update-stats-form").elements.deaths.value;if(""!=b&&""!=c&&""!=d&&""!=e&&""!=f){var g={};g.wins=parseInt(b,10),g.losses=parseInt(c,10),g.timePlayed=parseInt(d,10),g.eliminations=parseInt(e,10),g.deaths=parseInt(f,10),combineStatsDB(a,g);var h=document.getElementById("update-stats-div");h.remove()}}function deleteHeroHandler(a){window.confirm("Are you sure you want to delete "+a+"? All personal stats on this hero will be lost forever.")&&deleteHero(a)}function deleteHero(a){document.getElementById(a).remove(),deleteHeroDB(a)}function removeAllCards(){for(var a=document.getElementsByClassName("hero-card");a.length>0;)a[0].parentNode.removeChild(a[0])}function sortAtoZ(){var a=document.getElementsByClassName("hero-card"),b=document.getElementsByTagName("MAIN")[0];heroName=[],cardCopy=[];for(var c=0;c<a.length;c++)heroName.push(a[c].id+"_"+c),cardCopy[c]=a[c];heroName.sort(),removeAllCards();for(var c=0;c<cardCopy.length;c++)index=heroName[c].split("_")[1],b.appendChild(cardCopy[index])}function sortWinRate(){var a=document.getElementsByClassName("hero-card"),b=document.getElementsByTagName("MAIN")[0];winRate=[],cardCopy=[];for(var c=document.getElementsByClassName("win-rate-var"),d=0;d<a.length;d++)winRate.push(c[d].textContent+"_"+d),cardCopy[d]=a[d];winRate.sort(function(a,b){var c=a.split("_")[0],d=b.split("_")[0];return d-c}),removeAllCards();for(var d=0;d<cardCopy.length;d++)index=winRate[d].split("_")[1],b.appendChild(cardCopy[index])}function sortWins(){}function sort(){var a=document.getElementById("sort-selector"),b=a.options[a.selectedIndex].value;"alphabetical"==b?sortAtoZ():"winrate"==b&&sortWinRate()}