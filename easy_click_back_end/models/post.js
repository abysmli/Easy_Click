var mongodb = require('./db');
module.exports = Post;

function Post(username, title, content, location, contact, price, tags, prevtext, prevtext2, previmg, img, date, uid) {
  this.username = username;
  this.title = title;
  this.content = content;
  this.location = location;
  this.contact = contact;
  this.price = price;
  this.tags = tags;
  this.prevtext = prevtext;
  this.prevtext2 = prevtext2;
  this.previmg = previmg;
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

function postview(username, title, date, prevtext, prevtext2, previmg, uid) {
  this.username = username;
  this.title = title;
  this.date = date;
  this.prevtext = prevtext;
  this.prevtext2 = prevtext2;
  this.previmg = previmg;
  this.uid = uid;
};

Post.prototype.save = function save(db, callback) {
  var post = {
    username: this.username,
    title: this.title,
    content: this.content,
    location: this.location,
    contact: this.contact,
    price: this.price,
    tags: this.tags,
    prevtext: this.prevtext,
    prevtext2: this.prevtext2,
    previmg: this.previmg,
    img: this.img,
    date: this.date,
  };
  db.collection('posts', function(err, collection) {
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

Post.getAll = function getAll(db, mTags, mSkip, mLimit, callback) {
  db.collection('posts', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var tagReg='', tags = mTags.split(/[ ,;]+/);
    tags.forEach(function(tag, index){
      if(index!=0) {
        tagReg+='\|'+tag;
      } else {
        tagReg+=tag;
      }
    });
    var query = {
      tags: new RegExp(tagReg)
    };
    collection.find(query,{skip:mSkip,limit:mLimit}).sort({
      date: -1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      var posts = [];
      docs.forEach(function(doc, index) {
        var post = new postview(doc.username, doc.title, doc.date, doc.prevtext, doc.prevtext2, doc.previmg, doc._id);
        posts.push(post);
      });
      callback(null, posts);
    });
  });
};

Post.getbyUid = function getbyUid(db, uid, callback) {
  db.collection('posts', function(err, collection) {
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
      var post = new Post(doc.username, doc.title, doc.content, doc.location, doc.contact, doc.price, doc.tags, doc.prevtext, doc.prevtext2, doc.previmg, doc.img, doc.date, doc._id);
      callback(null, post);
    });
  });
};

Post.getbyTele = function getbyTele(db, tel, callback) {
  db.collection('posts', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.findOne({
      contact: new RegExp(tel)
    }, function(err, doc) {
      if (err) {
        callback(err, null);
      }
      if (null === doc) {
        callback("找不到你输入的联系方式", null);
      } else {
        var post = new Post(doc.username, doc.title, doc.content, doc.location, doc.contact, doc.price, doc.tags, doc.prevtext, doc.prevtext2, doc.previmg, doc.img, doc.date, doc._id);
        callback(null, post);
      }
    });
  });
};

Post.getbyUsername = function getbyUsername(db, username, callback) {
  db.collection('posts', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.find({username: username}).sort({
      date: -1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      var posts = [];
      docs.forEach(function(doc, index) {
        var post = new postview(doc.username, doc.title, doc.date, doc.prevtext, doc.prevtext2, doc.previmg, doc._id);
        posts.push(post);
      });
      callback(null, posts);
    });
  });
};

Post.remove = function remove(db, callback) {
  db.collection('posts', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.remove();
    callback(null);
  });
};


Post.prototype.modifybyUid = function modifybyUid(db, uid, callback) {
  var post = {
    username: this.username,
    title: this.title,
    content: this.content,
    location: this.location,
    contact: this.contact,
    price: this.price,
    tags: this.tags,
    prevtext: this.prevtext,
    prevtext2: this.prevtext2,
    previmg: this.previmg,
    img: this.img,
    date: this.date,
  };
  db.collection('posts', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var oid = new require('mongodb').ObjectID(uid);
    collection.findAndModify({
      _id: oid
    }, [
      ['_id', 1]
    ], post, function(err, post) {
      callback(err, post);
    });
  });
};

Post.removebyUid = function removebyUid(db, uid, callback) {
  db.collection('posts', function(err, collection) {
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