module.exports = Modules;

function Modules(id, content, date) {
  this.id = id;
  this.content = content;
  if (date) {
    this.date = date;
  } else {
    this.date = new Date();
  }
};

Modules.prototype.save = function save(db, callback) {
  var modules = {
    id: this.id,
    content: this.content,
    date: this.date,
  };
  db.collection('modules', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.findAndModify({
      id: modules.id
    }, [['id', 1]], modules, {upsert:true}, function(err, modules) {
      callback(err, modules);
    });
  });
};

Modules.getbyId = function getbyId(db, id, callback) {
  db.collection('modules', function(err, collection) {
    if (err) {
      return callback(err);
    }
    collection.findOne({
      id: id
    }, function(err, doc) {
      if (err) {
        callback(err, null);
      }
      if(doc!=null) {
        var modules = new Modules(doc.id, doc.content, doc.date);
        callback(null, modules);
      } else {
        callback(null, "");
      }
    });
  });
};