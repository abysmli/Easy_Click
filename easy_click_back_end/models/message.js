var db = require('./db');

module.exports = Message;

function Message(username, sender, message, date, readed, uid) {
  this.username = username;
  this.sender = sender;
  this.message = message;
  this.readed = readed;
  if (date) {
    this.date = date;
  } else {
    this.date = new Date();
  }
  if (!readed) {
    this.readed = false;
  }
  if (uid) {
    this.uid = uid;
  }
};

Message.prototype.save = function save(callback) {
  var message = {
    username: this.username,
    sender: this.sender,
    message: this.message,
    date: this.date,
    readed: this.readed,
  };
  db.collection('messages', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.ensureIndex({
      'username': 1
    });
    collection.insert(message, {
      safe: true
    }, function(err, message) {
      callback(err, message);
    });
  });
};

Message.getbyUsername = function getbyUsername(username, callback) {
  db.collection('messages', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var query = {};
    if (username) {
      query.username = username;
    }
    collection.find(query).sort({
      date: -1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      if(docs!=null) {
        var messages = [];
        docs.forEach(function(doc, index) {
          var message = new Message(doc.username, doc.sender, doc.message, doc.readed, doc.date, doc._id);
          messages.push(message);
        });
        callback(null, messages);
      } else {
        callback(null, "");
      }
    });
  });
};

Message.remove = function remove(callback) {
  db.collection('messages', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.remove();
    callback(null);
  });
};

Message.removebyUsername = function removebyUsername(Username, callback) {
  db.collection('messages', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.findAndRemove({
      username: Username
    }, [
      ['username', 0]
    ], function(err) {
      if (err) {
        return callback(err);
      }
    });
    callback(null);
  });
};

Message.removebyUid = function removebyUid(uid, callback) {
  db.collection('messages', function(err, collection) {
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