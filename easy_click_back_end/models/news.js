var db = require('./db');

module.exports = News;

function News(index, title, sub_title, source, sourceurl, newsdate, content, previmg, img, date, uid) {
  this.index = index;
  this.title = title;
  this.sub_title = sub_title;
  this.source = source;
  this.sourceurl = sourceurl;
  this.newsdate = newsdate;
  this.content = content;
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

function newsview(title, sub_title, newsdate, previmg, date, uid) {
  this.title = title;
  this.sub_title = sub_title;
  this.newsdate = newsdate;
  this.previmg = previmg;
  this.date = date;
  this.uid = uid;
};

News.prototype.save = function save(callback) {
  var news = {
    index: this.index,
    title: this.title,
    sub_title: this.sub_title,
    source: this.source,
    sourceurl: this.sourceurl,
    newsdate: this.newsdate,
    content: this.content,
    previmg: this.previmg,
    img: this.img,
    date: this.date,
  };
  db.collection('news', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.ensureIndex({
      'index': 1
    });
    collection.insert(news, {
      safe: true
    }, function(err, news) {
      callback(err, news);
    });
  });
};

News.getAll = function getAll(mSkip, mLimit, callback) {
  db.collection('news', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.find({},{skip:mSkip,limit:mLimit}).sort({
      date: -1
    }).toArray(function(err, docs) {
      if (err) {
        callback(err, null);
      }
      if(docs!=null) {
        var news_buffer = [];
        docs.forEach(function(doc, index) {
          var news = new newsview(doc.title, doc.sub_title, doc.newsdate, doc.previmg, doc.date, doc._id);
          news_buffer.push(news);
        });
        callback(null, news_buffer);
      } else {
        callback(null, {});
      }
    });
  });
};

News.getbyUid = function getbyUid(uid, callback) {
  db.collection('news', function(err, collection) {
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
        var news_buffer = new News(doc.index, doc.title, doc.sub_title, doc.source, doc.sourceurl, doc.newsdate, doc.content, doc.previmg, doc.img, doc.date, doc._id);
        callback(null, news_buffer);
      } else {
        callback(null, {});
      }
    });
  });
};

News.getNewstList = function getNewstList(limit, callback) {
  db.collection('news',function(err, collection){
    if(err){
      return callback(err);
    }
    collection.find().sort({date:-1}).limit(parseInt(limit)).toArray(function(err, docs){
      if(err){
        callback(err, null);
      }
      if (docs!=null) {
        var news = [];
        docs.forEach(function(doc, index){
          news.push({uid: doc._id, date: doc.date});
        });
        callback(null, news);
      } else {
        callback(null, []);
      }
    });
  });
}

News.getbyList = function getbyList(mList, callback) {
  db.collection('news', function(err, collection) {
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
        var news = [];
        docs.forEach(function(doc, index) {
          var _news = new newsview(doc.title, doc.sub_title, doc.newsdate, doc.previmg, doc.date, doc._id);
          news.push(_news);
        });
        callback(null, news);
      } else {
        callback(null, []);
      }
    });
  });
};

News.getNewstDate = function getNewstDate(uid, callback) {
  db.collection('news', function(err, collection){
    if (err) {
      return callback(err);
    }
    if(uid=="") {
      var query = {};
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

News.prototype.modifybyUid = function modifybyUid(uid, callback) {
  var news = {
    index: this.index,
    title: this.title,
    sub_title: this.sub_title,
    source: this.source,
    sourceurl: this.sourceurl,
    newsdate: this.newsdate,
    content: this.content,
    previmg: this.previmg,
    img: this.img,
    date: this.date,
  };
  db.collection('news', function(err, collection) {
    if (err) {
      return callback(err);
    }
    var oid = new require('mongodb').ObjectID(uid);
    collection.findAndModify({
      _id: oid
    }, [
      ['_id', 1]
    ], news, function(err, news) {
      callback(err, news);
    });
  });
};

News.remove = function remove(callback) {
  db.collection('news', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.remove();
    callback(null);
  });
};

News.removebyUid = function removebyUid(uid, callback) {
  db.collection('news', function(err, collection) {
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