// iTunes API Joint Anthony Kirkeeng, Jason Taylor, Benjamin Barnhill

// Initialized server
// npm init
// npm install express --save
// npm install body-parser --save
// npm install node-mon
// node app.js
// 

////////////////////////  Basic Functionality Requirements ////////////////////
// 1) Download music data for a single artist (of your choosing) and create the following endpoints for your API
// 2) List all songs
// 3) Find song by id -- results:trackID?  -- example  greenday+Macy's Day Parade       results:"trackId":1160081267
// 4) Find songs by name -- results:artistID  -- example greenday                        results:artistID:954266
// 5) Find songs by album id (collection id)  -- results:collectionId                    greenday+warning results:collectionId:1160081195 
// 6)Find songs by album name (collection name)  -- results:collectionName               greenday+warning results:"collectionName":"Warning", 
// 7) Update song information by id
// 8) Delete a song by id
// 9) Add a new song
///////////////////////////////////////////////////////////////////////////////
//  Itunes API - https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/
/////////////////////////////////////////////////////////////////////////////

// API format -- https://affiliate.itunes.apple.com/resources/documentation/itunes-store-web-service-search-api/
// example -- https://itunes.apple.com/search?term=greenday+warning&entity=musicTrack
// https://itunes.apple.com/search?term=green+day&limit=3&entity=song
// See attached file in folder "Greenday-warning-album.txt",  has 25 results 

const express = require('express')
const app = express()
//const users = require('./users.json') //Do we need this?
const bodyParser = require('body-parser')
var fetch = require('node-fetch')

app.use(express.json())

let songData = {}

async function getData() { //#TODO Add functionality to pass parameter to get different data #TODO Add multiple page handling
    let url = 'https://itunes.apple.com/search?term=green+day&limit=3&entity=song'
    let response= await fetch(url)
    songData = await response.json()
    //console.log(songData)
}

getData();

// #TODO filter on "kind"
app.get('/', (req, res) => {
    // let output = []
    // for (var i in songData.results) {
    //     // console.log(songData.results[i].trackName)
    //     let song=songData.results[i]
    //     let trackName = song.trackName
    //     output.push(trackName)
    // } 
    //  res.send(JSON.stringify(output))
    
    //Next line is the same as the 8 lines above
    function getTrackName(song) {
        return song.trackName
    }

    res.send(JSON.stringify(songData.results.map(getTrackName)))
})

// function to filter on trackID -- could be combined with trackname
app.get('/byTrackId/:id', (req,res) => { //#TODO Refactor to use trackId variable instead of id
    let id = parseInt(req.params.id)
    function checkTrackID (song) {
            return song.trackId === id
    } 
    res.send(JSON.stringify(songData.results.filter(checkTrackID)))
})

// function to filter on trackname
app.get('/tracks/:trackName', (req,res) => {
    
    let trackName = req.params.trackName
    //console.log(trackName)
    function checkTrackName (song) {
            return song.trackName === trackName
    } 
    res.send(JSON.stringify(songData.results.filter(checkTrackName)))
})

// function to filter on Album
app.get('/albums/:album', (req,res) => {
    let album = req.params.album
    if (isNaN(parseInt(album))){
        res.send(JSON.stringify(songData.results.filter(song => song.collectionName === req.params.album)))
        console.log("running album")
    }
    else {
        res.send(JSON.stringify(songData.results.filter(song => song.collectionId === parseInt(req.params.album))))  
    }
    // let trackName = req.params.trackName
    // function checkTrackName (song) {
    //         return song.trackName === trackName
  

    // function checkTrackName (song) {
    //         return song.trackName === req.params.trackName
    // } 
    
    //res.send(JSON.stringify(songData.results.filter(song => song.album === req.params.collectionName)))
})

// Exampple http://localhost:3000/delete/?trackId=1160082180  --Should remove "Basket Case"
//Function to delete trackId from local array
app.get('/delete', (req, res) => {
    let deleteTrack = parseInt(req.query.trackId); //returns a num placement of trackId
    for (var i = 0; i < songData.results.length; i++) {
        if (deleteTrack === songData.results[i].trackId){
            songData.results.splice(i, 1)
        }
    }
})

// #TODO Function to add TrackId to local array
app.post('/addTrack', (req, res) => {
    req.body
    songData.push()
})


const port = 3000
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
