require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const SpotifyWebApi = require('spotify-web-api-node')

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))


// Our routes go here:

app.get('/', (req, res) => {
    res.render('index')
  })





  app.get('/artist-search', (req, res) => {
    const artistQuery = req.query.searchTerm
    //console.log(artistQuery)



    spotifyApi
  .searchArtists(artistQuery)
  .then(data => {
    const searchResults = data.body.artists.items
    //console.log('The received data from the API: ', searchResults)

    res.render('artist-search-results', {searchResults})
})
.catch(err => console.log('The error while searching artists occurred: ', err))



})


app.get('/albums', (req, res) => {
    res.render('albums')
  })





  app.get('/albums/:artistId', async (req, res, next) => {

    const artistId = req.params.artistId
    const artistsAlbums = await spotifyApi.getArtistAlbums(artistId)

    .then((data)=>{
        const artistAlbums = data.body.items
        //console.log(console.log("ARTISTS ALBUMS", artistAlbums))



    res.render('albums', {artistAlbums})

   })
   .catch(err => console.log('The error while searching albums occurred: ', err))
  })



  app.get('/tracks/:albumId', async (req, res, next) => {

    const albumId = req.params.albumId
    const tracks = await spotifyApi.getAlbumTracks(albumId)

    .then((data)=>{
        const tracks = data.body.items
        console.log("TRACKS", tracks)



    res.render('tracks', {tracks})

   })
   .catch(err => console.log('The error while searching albums occurred: ', err))
  })




app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
