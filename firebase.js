var fdb;
var commentsRef;

function initFirebase() {
    async function load_scripts(script_urls) {
        function load(script_url) {
            return new Promise(function(resolve, reject) {
                if (load_scripts.loaded.has(script_url)) {
                    resolve();
                } else {
                    var script = document.createElement('script');
                    script.onload = resolve;
                    script.src = script_url
                    document.head.appendChild(script);
                }
            });
        }
        var promises = [];
        for (const script_url of script_urls) {
            promises.push(load(script_url));
        }
        await Promise.all(promises);
        for (const script_url of script_urls) {
            load_scripts.loaded.add(script_url);
        }
    }
    load_scripts.loaded = new Set();

    (async () => {
        await load_scripts([
            'https://www.gstatic.com/firebasejs/7.20.0/firebase-app.js',
            'https://www.gstatic.com/firebasejs/7.20.0/firebase-database.js',
        ]);
        var firebaseConfig = CONFIG.firebase;
        firebase.initializeApp(firebaseConfig);
        fdb = firebase.database();
        commentsRef = fdb.ref('comments');
        console.log('firebase ok');
        loadExistingUsers();
    })();	
}

function loadExistingUsers() {
    fdb.ref('users/').orderByChild('position').once('value', function(snapshot) {
        snapshot.forEach(function(childSnapshot) {  
            subscribedPlayers.set(childSnapshot.key, {"name": childSnapshot.val().name})                    
        });
      });
      ;
}

function writeUser(auth, name) {
    fdb.ref('users/' + auth).set({
        name: name,
        position: subscribedPlayers.size-1
    });
}


function deleteUser(auth) {
    fdb.ref('users/' + auth).remove();
}

function writeLog(p, msg) {
    commentsRef.push({name: p.name, auth:auth.get(p.id), msg:msg, time:Date.now(), formatted:(new Date(Date.now()).toLocaleString())});
}
