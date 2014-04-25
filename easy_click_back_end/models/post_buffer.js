var db = require('./db');

module.exports = Post_buffer;

function Post_buffer(username, location, content, contact, price, handled, img, date) {
  this.username = username;
  this.location = location;
  this.content = content;
  this.contact = contact;
  this.price = price;
  this.handled = handled;
  this.img = img;
  if (date) {
    this.date = date;
  } else {
    this.date = new Date();
  }
};

function postview(username, location, date, handled, img, uid) {
  this.username = username;
  this.location = location;
  this.date = date;
  this.handled = handled;
  this.img = img;
  this.uid = uid;
};

Post_buffer.prototype.save = function save(callback) {
  var post = {
    username: this.username,
    location: this.location,
    content: this.content,
    contact: this.contact,
    price: this.price,
    handled: this.handled,
    img: this.img,
    date: this.date,
  };
  db.collection('posts_buffer', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.insert(post, {
      safe: true
    }, function(err, post) {
      callback(err, post);
    });
  });
};

Post_buffer.getAll = function getAll(callback) {
  db.collection('posts_buffer', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.find({}).sort({
      date: 1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      if(docs!=null) {
        var posts = [];
        docs.forEach(function(doc, index) {
          var post = new postview(doc.username, doc.location, doc.date, doc.handled, doc.img, doc._id);
          posts.push(post);
        });
        callback(null, posts);
      } else {
        callback(null, "");
      }
    });
  });
};

Post_buffer.getbyUid = function getbyUid(uid, callback) {
  db.collection('posts_buffer', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var oid = new require('mongodb').ObjectID(uid);
    collection.findOne({
      _id: oid
    }, function(err, doc) {
      if (err) {
        callback(err, null);
      }
      if(doc!=null) {
        var post = new Post_buffer(doc.username, doc.location, doc.content, doc.contact, doc.price, doc.handled, doc.img, doc.date);
        callback(null, post);
      } else {
        callback(null, "");
      }
    });
  });
};

Post_buffer.setHandled = function setHandled(uid, callback) {
  db.collection('posts_buffer', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var oid = new require('mongodb').ObjectID(uid);
    collection.update({
      _id: oid
    }, {
      $set: {
        handled: true
      }
    });
  });
};

Post_buffer.remove = function remove(callback) {
  db.collection('posts_buffer', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.remove();
    callback(null);
  });
};

Post_buffer.removebyUid = function removebyUid(uid, callback) {
  db.collection('posts_buffer', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var oid = new require('mongodb').ObjectID(uid);
    collection.findAndRemove({
      _id: oid
    }, [
      ['_id', 1]
    ], function(err) {
      if (err) {
        return callback(err);
      }
    });
    callback(null);
  });
};