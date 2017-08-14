var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var body_parser = require('body-parser');

var html_Path = __dirname + "/pages/";
var username, password;
//var incorrect_info = new Event('log_mistake') // creating an event

// Getting the app to use some middleware for convenience
app.use(body_parser());

var users = {
    "user1": ["p1", "0"],
    "user2": ["password2", "0"],
    "user3": ["password3", "0"],
    "user4": ["password4", "0"],
    "user5": ["password5", "0"]
};

var options = [0, 0, 0, 0];
var time = true;
setTimeout(function(){io.sockets.emit('time_out', options); time=false;}, 300000);       // Timer set for 5 minutes

http.listen(3000, function () {
    console.log("Listening on 3000");
});

app.get('/', function (req, res) {      // Sends the user to an initial login page
    if (username && password && users[username]) {
        users[username][1] = 0
    }
    res.sendFile(html_Path + "login.html");
});

app.get("/vote", function (req, res) {      // Handles request to visit voting page
    if (time=false){setTimeout(function(){io.sockets.emit('time_out', options); time=false;}, 300000);};
    if (username && password && users[username] && users[username][1] == 1) {
        res.sendFile(html_Path + "vote.html");
    } else {
        res.sendFile(html_Path + "login.html")
    }
});

app.get("/login", function (req, res) {      // Sends the user to the login page
    res.sendFile(html_Path + "login.html");
});

app.get("*", function (req, res) {      // Sends the user to an error page
    res.sendFile(html_Path + "404.html");
});

io.on('connection', function (socket) { // Prints to the console when a client connects to the server
    console.log("A user connected");
    socket.on('disconnect', function () {    // Prints to the console when a client disconnects from the server
        console.log('A user disconnected');
    });
    socket.on('vote', function (opt_index) {        // receive incoming votes
        options[opt_index] += 1;
        io.sockets.emit('vote_update', options);    // broadcast new tally
    });
});

app.post('/login', function (req, res) {    // respond to a user trying to log in
    username = req.body.username;
    password = req.body.password;
;
    if (username && password && users[username] && users[username][0] == password) {
        users[username][1] = 1
        res.sendFile(html_Path + 'vote.html');      // Send the user to the voting page
    } else {
        res.send("Incorrect username/password, please try again"); // Error message when username/password aren't correct
        req.body.username = "";     // resets the username field
        req.body.password = "";     // resets the password field
    }
});

//res.send(); // Send a basic message to the page
//socket.emit('news', { hello: 'working' });    // Sends data given by hello with the tag 'news'