'use strict'

const urllib = require('urllib')

const LASTFM_HOST = 'http://ws.audioscrobbler.com/2.0/'
const LASTFM_KEY = '79b2506be8ce86d852882e1774f1f2e8'
const LASTFM_TOP_TRACKS = `?method=artist.gettoptracks&api_key=${LASTFM_KEY}&format=json&artist=`
const LASTFM_SEARCH_ARTIST = `?method=artist.search&artist=`

/**
 * @param {String} artist 
 * @param {function(Error, Array)} cb Callback that receives an array with tracks names
 * of given artist, or an Error if it does not succeed.
 */
function getTopTracks(artist, cb) {
    const url = LASTFM_HOST + LASTFM_TOP_TRACKS + artist
    urllib.request(url, (err, data, res) => {
        if(err) return cb(err)
        const obj = JSON.parse(data)
        if(obj.error) return cb(new Error(obj.message))
        const tracks = obj.toptracks.track.map(t => t.name)
        cb(null, tracks)
    })
}

/**
 * @param {String} artist Artist name
 * @param {function(Error, Array)} cb Callback receives an array of Artist objects with given 
 * name or  an Error if there is no Artist with given name.
 *

 */
//http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=kjahkdfhalf&api_key=79b2506be8ce86d852882e1774f1f2e8&format=json
function searchArtist(artist, cb) {
    const url = LASTFM_HOST + LASTFM_SEARCH_ARTIST + artist + `&api_key=${LASTFM_KEY}&format=json&artist=`
    urllib.request(url,(err,data,res)=>{
        //console.log(data.toString())
        if(err) return cb(err)
        const obj = JSON.parse(data)
        const arrayArt = obj.results.artistmatches.artist.filter(t => t.name == artist)
        if(arrayArt.length == 0){
           return cb(new Error(`There is no artists with the name ${artist}`))
        }   
        cb(null,arrayArt[0].name)
    })
}

module.exports = {
    getTopTracks,
    searchArtist
}