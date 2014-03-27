module.exports = Shops_buffer;

function Shops_buffer(title, content, img, user, date, handled) {
  this.title = title;
  this.content = content;
  this.img = img;
  this.user = user;
  if (date) {
    this.date = date;
  } else {
    this.date = new Date();
  }
  if (handled) {
    this.handled = true;
  } else {
    this.handled = false;
  }
};

function shopview(title, user, date, handled, uid) {
  this.title = title;
  this.user = user;
  this.date = date;
  this.handled = handled;
  this.uid = uid;
};

Shops_buffer.prototype.save = function save(db, callback) {
  var shop = {
    title: this.title,
    content: this.content,
    img: this.img,
    user: this.user,
    date: this.date,
    handled: this.handled,
  };
  db.collection('shops_buffer', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.ensureIndex({
      'title': 1
    });
    collection.insert(shop, {
      safe: true
    }, function(err, shop) {
      callback(err, shop);
    });
  });
};

Shops_buffer.getAll = function getAll(db, callback) {
  db.collection('shops_buffer', function(err, collection) {
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
        var shops_buffer = [];
        docs.forEach(function(doc, index) {
          var shop = new shopview(doc.title, doc.user, doc.date, doc.handled, doc._id);
          shops_buffer.push(shop);
        });
        callback(null, shops_buffer);
      }
    });
  });
};

Shops_buffer.getbyUid = function getbyUid(db, uid, callback) {
  db.collection('shops_buffer', function(err, collection) {
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
        var shop = new Shops_buffer(doc.title, doc.content, doc.img, doc.user, doc.date, doc.handled);
        callback(null, shop);
      } else {
        callback(null, "");
      }
    });
  });
};

Shops_buffer.setHandled = function setHandled(db, uid, callback) {
  db.collection('shops_buffer', function(err, collection) {
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

Shops_buffer.remove = function remove(db, callback) {
  db.collection('shops_buffer', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.remove();
    callback(null);
  });
};

Shops_buffer.removebyUid = function removebyUid(db, uid, callback) {
  db.collection('shops_buffer', function(err, collection) {
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