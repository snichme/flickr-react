var http = require("http");
var when = require("when");
var Flickr = require("node-flickr");

function supplant() {
  var args = 1 <= arguments.length ? [].slice.call(arguments, 0) : [];
  var string = args.shift();
  var data = args.shift();
  return string.replace(/\{([^{}]*)\}/g, function (a, b) {
  	var r = data[b];
    return typeof r === 'string' || typeof r === 'number' ? r : a;
  });
}

function getUrl(photo, size) {
  size = size || 'm';
  var template = "http://farm{farm}.staticflickr.com/{server}/{id}_{secret}_{size}.jpg";
  var data = {
    farm: photo.farm,
    server: photo.server,
	  id: photo.id,
	  secret: photo.secret,
	  size: size
  };
  return supplant(template, data);
}

function parseResponse(photos) {
  return photos.map(function(photo) {
	  return {
	    title: photo.title,
	    small: getUrl(photo, 'n'),
	    large: getUrl(photo, 'b')
	  };
  });
}

if(!process.env["FLICKR_KEY"]) {
  console.error("You need to supply your flickr API key as env variable FLICKR_KEY");
  process.exit(1);
}
var keys = {"api_key": process.env["FLICKR_KEY"]};
var flickr = new Flickr(keys);

function search(query) {
  var deferred = when.defer();
  var data = {
	"format":"json",
    "nojsoncallback": 1,
    "text": query
  };
  flickr.get("photos.search", data, function(err, result){
	if (err) return console.error(err);
	var photos = result.photos.photo;
    deferred.resolve(parseResponse(photos));
  });
  return deferred.promise;
}

module.exports = {
  search: search
};
