var mongodb = require('./db');
module.exports = Learn;

function Learn(index, title, content, img, date) {
  this.index = index;
  this.title = title;
  this.content = content;
  this.img = img;
  if (date) {
    this.date = date;
  } else {
    this.date = new Date();
  }
};

function Learnlist(index, title, uid) {
  this.index = index;
  this.title = title;
  this.uid = uid;
};

Learn.prototype.save = function save(db, callback) {
  var learn = {
    index: this.index,
    title: this.title,
    content: this.content,
    img: this.img,
    date: this.date
  };
  db.collection('learning', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.insert(learn, {
      safe: true
    }, function(err, learn) {
      callback(err, learn);
    });
  });
};


Learn.prototype.modifybyUid = function modifybyUid(db, uid, callback) {
  var learn = {
    index: this.index,
    title: this.title,
    content: this.content,
    img: this.img,
    date: this.date,
  };
  db.collection('learning', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var oid = new require('mongodb').ObjectID(uid);
    collection.findAndModify({
      _id: oid
    }, [
      ['_id', 1]
    ], learn, function(err, learn) {
      callback(err, learn);
    });
  });
};

Learn.getAll = function getAll(db, callback) {
  db.collection('learning', function(err, collection) {
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
        var learns = [];
        docs.forEach(function(doc, index) {
          var learn = new Learnlist(doc.index, doc.title, doc._id);
          learns.push(learn);
        });
        callback(null, learns);
      }
    });
  });
};

Learn.getbyIndex = function getbyIndex(db, index, callback) {
  db.collection('learning', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var query = {};
    if (index) {
      query.index = index;
    }
    collection.find(query).sort({
      date: 1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      if(docs!=null) {
        var learns = [];
        docs.forEach(function(doc, index) {
          var learn = new Learnlist(doc.index, doc.title, doc._id);
          learns.push(learn);
        });
        callback(null, learns);
      }
    });
  });
};

Learn.getbyUid = function getbyUid(db, uid, callback) {
  db.collection('learning', function(err, collection) {
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
        var learn = new Learn(doc.index, doc.title, doc.content, doc.img, doc.date);
        callback(null, learn);
      }
    });
  });
};

Learn.remove = function remove(db, callback) {
  db.collection('learning', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.remove();
    callback(null);
  });
};


Learn.removebyUid = function removebyUid(db, uid, callback) {
  db.collection('learning', function(err, collection) {
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