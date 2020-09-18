let subscribedPlayers = new Map();
var mypool = [		
];
let auth = new Map();

(async function () {
	console.log("Running Server...");
	const room = window.WLInit({
		token: window.WLTOKEN,
		roomName: "⚠️Tournament saturday⚠️ REGISTER",
		maxPlayers: 15,	
		public: true
	});

	room.setSettings({
		scoreLimit: 2,
		timeLimit: 3,
		gameMode: "dm",
		levelPool: "rng",
		respawnDelay: 3,
		bonusDrops: "health",
		maxDuplicateWeapons: 2
	});
	window.WLROOM = room;

	room.onRoomLink = (link) => console.log(link);
	room.onCaptcha = () => console.log("Invalid token");

	const admins = new Set(CONFIG.admins);

	initFirebase();
	genNewMap();

	room.onPlayerJoin = (player) => {
		if ( admins.has(player.auth) ) {
		room.setPlayerAdmin(player.id, true);
		}
		room.sendAnnouncement("Hi, this room is dedicated to registration to the tournament,", player.id, 2550000, "italic", 1);
		room.sendAnnouncement("the tournament is planned for saturday, the 19 the of september 2020, starting at 2:00pm UTC,", player.id, 2550000, "italic", 1);	
		room.sendAnnouncement("if you want to take part in it please type 'register' in the chat box", player.id, 2550000, "italic", 1);
		
		if (!player.auth){
			room.sendAnnouncement("you will need to get an auth key to register, please go to https://www.webliero.com/playerauth to check your key is properly set and join this room again", player.id, 2550000, "bold", 1);	
		} else {
			if (subscribedPlayers.get(player.auth)) {
				room.sendAnnouncement("you are already registered for the tournament, you can cancel by typing 'cancel'", player.id, 2550000, "bold", 1);
			} else {
				room.sendAnnouncement("your auth key ("+player.auth+")will be used for the registration, so it would be best that you register from the browser you will use to play", player.id, 2550000, "bold", 1);
			}
			auth.set(player.id, player.auth);
		}
		room.sendAnnouncement("Please join use on discord for more information at: "+CONFIG.discord_invite+" (discord link updated for those for whom it didn't work)", player.id, 2550000, "italic", 1);
	}

	room.onPlayerLeave = function(player) {  
		auth.delete(player.id);
	}


	room.onGameEnd2 = function() {
			genNewMap();
	}

	room.onPlayerChat = function (p, m) {
		console.log(p.name+" "+m);
		if (m=="register") {
			register(p);
		} else if (m=="cancel") {
			cancel(p);
		} else {
			writeLog(p,m);
		}
	}

	function register(p) {
		let a = auth.get(p.id);
		let subbed = subscribedPlayers.get(a);
		if (subbed) {				
			room.sendAnnouncement("you are already registered for the tournament, join us on discord for more information, you can cancel by typing 'cancel'", p.id, 2550000, "italic", null);
		} else {
			subscribedPlayers.set(a, p);
			console.log(a);
			room.sendAnnouncement("thanks "+p.name+" your registration is done good luck to you!", p.id, 2550000, "italic", null);
			room.sendAnnouncement("public key is "+a, p.id, 2550000, "italic", null);
			room.sendAnnouncement("there are now "+subscribedPlayers.size+" players registered", p.id, 2550000, "italic", null);
			room.sendAnnouncement("you can remove your registration by typing 'cancel' anytime until the tournament begins", p.id, 2550000, "italic", null);
			genNewMap();
			console.log(JSON.stringify(p));
			writeUser(a,p.name);
		}
	}

	function cancel(p) {
			let a = auth.get(p.id);
			console.log("auth"+a);
			let subbed = subscribedPlayers.get(a);
			console.log(subbed);
			if (subbed) {								
				subscribedPlayers.delete(a);
				room.sendAnnouncement("your registration has been canceled", p.id, 2550000, "italic", null);
				console.log(JSON.stringify(subscribedPlayers));
				genNewMap();
				deleteUser(a);
				return;
			}
						
			room.sendAnnouncement("it seems your registration was not found", p.id, 2550000, "italic", null);
	}

})();
