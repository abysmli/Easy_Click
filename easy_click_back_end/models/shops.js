var db = require('./db');
var utils = require('../utils/utils.js');

module.exports = Shops;

function Shops(username, index, title, instruction, name, brief, comment, telephone, email, url, address, path, expire, tags, prevtext, prevtext2, previmg, img, date, uid) {
  this.username = username;
  this.index = index;
  this.title = title;
  this.instruction = instruction;
  this.name = name;
  this.brief = brief;
  this.comment = comment;
  this.telephone = telephone;
  this.email = email;
  this.url = url;
  this.address = address;
  this.path = path;
  this.expire = expire;
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

function shopview(title, username, expire, date, prevtext, prevtext2, previmg, uid) {
  this.title = title;
  this.username = username;
  this.expire = expire;
  this.date = date;
  this.prevtext = prevtext;
  this.prevtext2 = prevtext2;
  this.previmg = previmg;
  this.uid = uid;
};

Shops.prototype.save = function save(callback) {
  var shop = {
    username: this.username,
    index: this.index,
    title: this.title,
    instruction: this.instruction,
    name: this.name,
    brief: this.brief,
    comment: this.comment,
    telephone: this.telephone,
    email: this.email,
    url: this.url,
    address: this.address,
    path: this.path,
    expire: this.expire,
    tags: this.tags,
    prevtext: this.prevtext,
    prevtext2: this.prevtext2,
    previmg: this.previmg,
    img: this.img,
    date: this.date,
  };
  db.collection('shops', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.ensureIndex({
      'index': 1
    });
    collection.insert(shop, {
      safe: true
    }, function(err, shop) {
      callback(err, shop);
    });
  });
};

Shops.getAll = function getAll(callback) {
  db.collection('shops', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.find({}).sort({
      date: -1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      if(docs!=null) {
        var shops_buffer = [];
        docs.forEach(function(doc, index) {
          var shop = new shopview(doc.title, doc.username, doc.expire, doc.date, doc.prevtext, doc.prevtext2, doc.previmg, doc._id);
          shops_buffer.push(shop);
        });
        callback(null, shops_buffer);
      } else {
        callback(null, []);
      }
    });
  });
};

Shops.getbyIndex = function getbyIndex(index, callback) {
  db.collection('shops', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var query = {};
    if (index) {
      query.index = index;
    }
    collection.find(query).sort({
      date: -1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      if(docs!=null) {
        var shops = [];
        docs.forEach(function(doc, index) {
          var shop = new shopview(doc.title, doc.username, doc.expire, doc.date, doc.prevtext, doc.prevtext2, doc.previmg, doc._id);
          shops.push(shop);
        });
        callback(null, shops);
      } else {
        callback(null, "");
      }
    });
  });
};

Shops.getList_expire = function getList_expire(mIndex, mTags, mSkip, mLimit, callback) {
  db.collection('shops', function(err, collection) {
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
      index: mIndex,
      tags: new RegExp(tagReg),
      $or: [{expire: {$gte: new Date()}},{expire: {$lt: new Date("2000-01-01")}},{expire: ""}]
    };
    if(mIndex==="") {
      query = {
        tags: new RegExp(tagReg),
        $or: [{expire: {$gte: new Date()}},{expire: {$lt: new Date("2000-01-01")}},{expire: ""}]
      };
    }
    collection.find(query, {
      skip: mSkip,
      limit: mLimit
    }).sort({
      date: -1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      if(docs!=null) {
        var shops = [];
        docs.forEach(function(doc, index) {
          var shop = new shopview(doc.title, doc.username, doc.expire, doc.date, doc.prevtext, doc.prevtext2, doc.previmg, doc._id);
          shops.push(shop);
        });
        callback(null, shops);
      } else {
        callback(null, "");
      }
    });
  });
};

Shops.getbyList = function getbyList(mList, callback) {
  db.collection('shops', function(err, collection) {
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
        var shops = [];
        docs.forEach(function(doc, index) {
          var shop = new shopview(doc.title, doc.username, doc.expire, doc.date, doc.prevtext, doc.prevtext2, doc.previmg, doc._id);
          shops.push(shop);
        });
        callback(null, shops);
      } else {
        callback(null, "");
      }
    });
  });
};

Shops.getbyUid = function getbyUid(uid, callback) {
  db.collection('shops', function(err, collection) {
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
        var shop = new Shops(doc.username, doc.index, doc.title, doc.instruction, doc.name, doc.brief, doc.comment, doc.telephone, doc.email, doc.url, doc.address, doc.path, doc.expire, doc.tags, doc.prevtext,  doc.prevtext2, doc.previmg, doc.img, doc.date, doc._id);
        callback(null, shop);
      } else {
        callback(null, "");
      }
    });
  });
};

Shops.getbyTele = function getbyTele(tel, callback) {
  db.collection('shops', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.findOne({
      telephone: new RegExp(tel)
    }, function(err, doc) {
      if (err) {
        callback(err, null);
      }
      if (null === doc) {
        callback("找不到你输入的联系方式", null);
      } else {
        var shop = new Shops(doc.username, doc.index, doc.title, doc.instruction, doc.name, doc.brief, doc.comment, doc.telephone, doc.email, doc.url, doc.address, doc.path, doc.expire, doc.tags, doc.prevtext, doc.prevtext2, doc.previmg, doc.img, doc.date, doc._id);
        callback(null, shop);
      }
    });
  });
};

Shops.getNewstDate = function getNewstDate(index, uid, callback) {
  db.collection('shops', function(err, collection){
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
        callback(null, "");
      }
    });
  });
}

Shops.getNewstList = function getNewstList(index, limit, callback) {
  db.collection('shops',function(err, collection){
    if(err){
      return callback(err);
    }
    var query = {
      index: index, 
      $or: [{expire: {$gte: new Date()}},{expire: {$lt: new Date("2000-01-01")}},{expire: ""}]
    };
    collection.find(query).sort({date:-1}).limit(parseInt(limit)).toArray(function(err, docs){
      if(err){
        callback(err, null);
      }
      if (docs!=null) {
        var shops = [];
        docs.forEach(function(doc, index){
          shops.push({uid: doc._id, date: doc.date});
        });
        callback(null, shops);
      } else {
        callback(null, "");
      }
    });
  });
}

Shops.prototype.modifybyUid = function modifybyUid(uid, callback) {
  var shop = {
    username: this.username,
    index: this.index,
    title: this.title,
    instruction: this.instruction,
    name: this.name,
    brief: this.brief,
    comment: this.comment,
    telephone: this.telephone,
    email: this.email,
    url: this.url,
    address: this.address,
    path: this.path,
    expire: this.expire,
    tags: this.tags,
    prevtext: this.prevtext,
    prevtext2: this.prevtext2,
    previmg: this.previmg,
    img: this.img,
    date: this.date,
  };
  db.collection('shops', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var oid = new require('mongodb').ObjectID(uid);
    collection.findAndModify({
      _id: oid
    }, [
      ['_id', 1]
    ], shop, function(err, shop) {
      callback(err, shop);
    });
  });
};

Shops.remove = function remove(callback) {
  db.collection('shops', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.remove();
    callback(null);
  });
};

Shops.removebyUid = function removebyUid(uid, callback) {
  db.collection('shops', function(err, collection) {
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