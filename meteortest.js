Tiles = new Mongo.Collection("tiles"); 
if (Meteor.isClient) {
  Template.body.helpers({
    tiles: function () {
      return Tiles.find({}, {sort: {createdAt: -1}});
    }
  });




  Template.body.events({
    'click': function (a, b) { 
      var x = a.pageX,
          y = a.pageY;

      var grid = pixel2grid(x, y, 0);

      console.log(x, y);

      Tiles.insert({
        x: x,
        y: y,
        type: 'cobblestone'
      });
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}




// Tiling logic
var Tile = {
  width: 128,
  height: 96,
  surface: 64,
  elevation: 32,

  offset: [
    0,
    -25 
  ]
}

function pixel2grid (x, y, height) {
  var i, j;
  y += height * Tile.elevation + Tile.offset[1];
  i = Math.floor(x / Tile.width - y / Tile.surface);
  j = Math.floor(x / Tile.width + y / Tile.surface);
  return [i, j];
}

function grid2pixel(i, j, height) { 
  var x, y;
  x = i * Tile.width / 2  + j * Tile.width / 2;
  y = -i * Tile.top / 2 + j * Tile.top / 2;
  y -= height * Tile.elevation;
  return [x, y]; 
}
