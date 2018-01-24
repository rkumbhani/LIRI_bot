// LIRI BOT - Ruhi Kumbhani

// Require set-up
var path = require("path");
var fs = require("fs");
var Twitter = require("twitter");
var spotify = require("spotify");
var omdb = require("omdb");
var request = require("request");
var input1 = process.argv[2];
var input2 = process.argv.splice(3).join(" ");

// Set-up log
function log() {
    // appending input
    fs.appendFile("./log.txt", input1 + " " + input2 + ", ", function(err) {

        // console.log errors if they occur
        if (err) { 
            console.log(err); }

        else {
            // console.log("No errors"); 
        }
    });
};

// Require API Keys
var keys = require("./keys.js");

// Get Twitter data
var client = new Twitter(keys.twitterKeys);
var params = {
    screen_name: "rubearrx",
    count: 20
};

// Create callback
run();

// Tweet function
function run() {

    if (input1 === "my-tweets") {

        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                console.log('');
                console.log('Latest 20 Tweets: ');
                console.log('~~~~~~~~~~~~~~~~~~~~');
                tweets.forEach(function(individualTweet) {
                    console.log('Posted at: ' + individualTweet.created_at);
                    console.log('Tweet: ' + individualTweet.text);
                    console.log('~~~~~~~~~~~~~~~~~~~~');
                });

            } else {
                console.log(error);
            };
        });

        log();

    } else if (input1 === "spotify-this-song") {

        if (input2.length < 1) {

            input2 = "Surrender the Throne";
        };

        spotify.search({ type: 'track', query: input2 }, function(err, data) {
            if (err) {
                console.log('Error occurred: ' + err);
                return;
            }
            console.log('');
            console.log('Spotify Results: ');
            console.log('~~~~~~~~~~~~~~~~~~~~~~');
            console.log("Artist: " + data.tracks.items[0].artists[0].name);
            console.log("Track Title: " + data.tracks.items[0].name);
            console.log("Album Title: " + data.tracks.items[0].album.name);
            console.log("Link to Song: " + data.tracks.items[0].preview_url);
            console.log('~~~~~~~~~~~~~~~~~~~~~~');
        });

        log();

    } else if (input1 === "movie-this") {
        if (input2.length < 1) {
            input2 = "Harry Potter";
        };

        // Then run a request to the OMDB API with the movie specified
        request("http://www.omdbapi.com/?apikey=f8b248?t=" + input2 + "&y=&plot=short&r=json&tomatoes=true", function(error, response, body) {

            if (!error && response.statusCode === 200) {

                // Parse movie details from OMDB
                console.log('');
                console.log('OMDB Movie Info: ');
                console.log('~~~~~~~~~~~~~~~~~~~~~~~');
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Release Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("Movie Plot: " + JSON.parse(body).Plot);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Rotten Tomatoes URL: " + JSON.parse(body).tomatoURL);
                console.log('~~~~~~~~~~~~~~~~~~~~~~~');
            } 
            
            else {
                console.log(error);
            }
        });

        log();

    } else if (input1 === "do-what-it-says") {

        log();
        
        // Push log to log.txt using fs
        fs.readFile('log.txt', 'utf8', function(err, data) {
            if (err) throw err;
            var arr = data.split(',');
            input1 = arr[0].trim();
            input2 = arr[1].trim();
            
            run();
        });
    }
};