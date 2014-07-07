var db = require('./db');

module.exports = Comments;

function Comments(handler, id, username, content, date) {
  this.handler = handler;
  this.id = id;
  this.username = username;
  this.content = content;
  if (date) {
    this.date = date;
  } else {
    this.date = new Date();
  }
};

Comments.prototype.save = function save(callback) {
  var comment = {
    handler: this.handler,
    id: this.id,
    username: this.username,
    content: this.content,
    date: this.date,
  };
  db.collection('comments', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.insert(comment, {
      safe: true
    }, function(err, comment) {
      callback(err, comment);
    });
  });
};

Comments.getbyId = function getbyId(handler, id, callback) {
  db.collection('comments', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.find({id: id, handler:handler}).sort({
      date: -1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      if(docs!=null) {
        var comments = [];
        docs.forEach(function(doc, index) {
          comments.push({username: doc.username, content: doc.content, date: doc.date});
        });
        callback(null, comments);
      } else {
        callback(null, []);
      }
    });
  });
};