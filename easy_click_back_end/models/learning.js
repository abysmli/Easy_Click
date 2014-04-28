var db = require('./db');

module.exports = Learn;

function Learn(index, title, content, img, date, uid) {
  this.index = index;
  this.title = title;
  this.content = content;
  this.img = img;
  if (date) {
    this.date = date;
  } else {
    this.date = new Date();
  }
  if (uid) {
    this.uid = uid;
  } else {
    this.uid = null;
  }
};

function Learnlist(index, title, date, uid) {
  this.index = index;
  this.title = title;
  this.date = date;
  this.uid = uid;
};

Learn.prototype.save = function save(callback) {
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


Learn.prototype.modifybyUid = function modifybyUid(uid, callback) {
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

Learn.getAll = function getAll(callback) {
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
          var learn = new Learnlist(doc.index, doc.title, doc.date, doc._id);
          learns.push(learn);
        });
        callback(null, learns);
      } else {
        callback(null, []);
      }
    });
  });
};

Learn.getbyIndex = function getbyIndex(index, callback) {
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
          var learn = new Learnlist(doc.index, doc.title, doc.date, doc._id);
          learns.push(learn);
        });
        callback(null, learns);
      } else {
        callback(null, []);
      }
    });
  });
};

Learn.getbyUid = function getbyUid(uid, callback) {
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
        var learn = new Learn(doc.index, doc.title, doc.content, doc.img, doc.date, doc._id);
        callback(null, learn);
      } else {
        callback(null, {});
      }
    });
  });
};

Learn.getbyList = function getbyList(mList, callback) {
  db.collection('learning', function(err, collection) {
    if (err) {
      return callback(err);
    }
    mList.forEach(function(list, index){
      var oid = new require('mongodb').ObjectID(list);
      mList[index]=oid;
    });
    var query = {
      _id: {$in: mList}
    };
    collection.find(query).sort({
      date: -1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      if(docs!=null) {
        var learning = [];
        docs.forEach(function(doc, index) {
          var learn = new Learnlist(doc.index, doc.title, doc.date, doc._id);
          learning.push(learn);
        });
        callback(null, learning);
      } else {
        callback(null, []);
      }
    });
  });
};

Learn.getNewstList = function getNewstList(index, callback) {
  db.collection('learning',function(err, collection){
    if(err){
      return callback(err);
    }
    collection.find({index: index}).sort({date:-1}).toArray(function(err, docs){
      if(err){
        callback(err, null);
      }
      if (docs!=null) {
        var learning = [];
        docs.forEach(function(doc, index){
          learning.push({uid: doc._id, date: doc.date});
        });
        callback(null, learning);
      } else {
        callback(null, []);
      }
    });
  });
}

Learn.getNewstDate = function getNewstDate(index, uid, callback) {
  db.collection('learning', function(err, collection){
    if (err) {
      return callback(err);
    }
    if(uid=="") {
      var query = {index: index};
    } else {
      var oid = new require('mongodb').ObjectID(uid);
      var query = {
        _id: oid
      };
    }
    collection.find(query).sort({date:-1}).limit(1).toArray(function(err, doc){
      if (err) {
        callback(err, null);
      }
      if (doc[0]!=null) {
        callback(null, doc[0].date);
      } else {
        callback(null, []);
      }
    });
  });
}

Learn.remove = function remove(callback) {
  db.collection('learning', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.remove();
    callback(null);
  });
};

Learn.removebyUid = function removebyUid(uid, callback) {
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