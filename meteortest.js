// Tiling logic
var Tile = {
  width: 128,
  height: 96,
  surface: 64,
  elevation: 32,

  offset: [
    0,
    -25 
  ],

  Place: function (x, y, h, type) { 
    var grid = pixel2grid(x, y, h);
    var pixel = grid2pixel(grid[0], grid[1], grid[2]);

    return {
      i: grid[0],
      j: grid[1],
      h: h,
      x: pixel[0],
      y: pixel[1],
      z: pixel[2],
      type: type
    }
  },

  Check: function (i, j, h) {
    /* 
    var cached = Session.get('cachedTile');
    if (cached) {
      if (cached.tile.i === i && cached.tile.j === j && cached.tile.z === z) {
        if (cached.hit)
          return cached.tile;
        else
          return undefined
      }
    }
    */
    
    var current = Tiles.findOne({i: i, j: j, h: h});


    /*
    if (current)
      Session.set('cachedTile', {hit: true, tile: current});
    else
      Session.set('cachedTile', {hit: false, tile: {i: i, j: j, z: z}});
    */

    return current;
  }
}

var World = {
  left: 300
}

function pixel2grid (x, y, height) {
  var i, j;
  x -= World.left;
  y += height * Tile.elevation + Tile.offset[1];
  i = Math.floor(x / Tile.width - y / Tile.surface);
  j = Math.floor(x / Tile.width + y / Tile.surface);
  return [i, j, height];
}

function grid2pixel(i, j, height) { 
  var x, y, z;
  x = i * Tile.width / 2  + j * Tile.width / 2;
  y = -i * Tile.surface / 2 + j * Tile.surface / 2;
  y -= height * Tile.elevation;
  z = -i + j + height;
  return [x, y, z]; 
}




Tiles = new Mongo.Collection("tiles"); 
if (Meteor.isClient) {
  Session.set('wireframe', Tile.Place(0, 0, 0, 'wireframe'));

  Template.world.helpers({
    tiles: function () {
      return Tiles.find({});
    },

    wireframe: function () {
      return Session.get('wireframe');
    },

    negative: function () { 
      if (Session.get('negative') === true) return 'negative'
      return ''
    }
  });

  Template.world.events({
    'click': function (a) { 
      var x = a.pageX,
          y = a.pageY;
          h = Number(document.getElementById('elevation').value) || 0,
					type = document.getElementById("type").value;
	

      var clicked = Tile.Place(x, y, h, type);

      var existing = Tile.Check(clicked.i, clicked.j, clicked.h)
      if (existing) {
        Session.set('negative', false);
        Tiles.remove(existing._id);
      } else { 
        Session.set('negative', true);
        Tiles.insert(clicked);
      }
    },

    'mousemove': function (a) {
      var x = a.pageX,
          y = a.pageY,
          h = Number(document.getElementById('elevation').value) || 0;

      var tile = Tile.Place(x, y, h);

      if (Tile.Check(tile.i, tile.j, tile.h)) { 
        Session.set('negative', true);
      } else {
        Session.set('negative', false);
      }

//console.log(Tile.Check(tile.i, tile.j, tile.z));

      var wireframe = Session.get('wireframe');
      wireframe.x = tile.x; 
      wireframe.y = tile.y; 
      wireframe.z = tile.z; 
      Session.set('wireframe', wireframe);
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
