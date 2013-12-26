var crypto = require('crypto');
var Posts = require('../models/post.js');
var Posts_buffer = require('../models/post_buffer.js');
var Shops = require('../models/shops.js');
var Shops_buffer = require('../models/shops_buffer.js');
var News = require('../models/news.js');
var User = require('../models/user.js');
var Messages = require('../models/message.js');
var Learn = require('../models/learning.js');
var util = require('util');
var async = require('async');
var utils = require('../utils/utils.js');

module.exports = function(app) {
  app.get('/', function(req, res) {
    res.render('index', {
      title: '',
      pageid: 'index_page'
    });
  });

  app.get('/information', function(req, res) {
    res.render('./information/information', {
      title: '信息',
      pageid: 'information_page'
    });
  });

  app.get('/information/:catagory', function(req, res) {
    Shops.getList_expire(req.database, req.params.catagory, "", 0, 15, function(err, shops) {
      if (err) {
        shops = [];
      }
      if (req.params.catagory == "find_job") {
        res.render('./information/information_catagory', {
          title: '工作',
          pageid: 'information_catagory_page工作',
          shops: shops,
        });
      } else if (req.params.catagory == "find_house") {
        res.render('./information/information_catagory', {
          title: '找房',
          pageid: 'information_catagory_page找房',
          shops: shops,
        });
      } else if (req.params.catagory == "move_house") {
        res.render('./information/information_catagory', {
          title: '搬家',
          pageid: 'information_catagory_page搬家',
          shops: shops,
        });
      } else if (req.params.catagory == "business") {
        res.render('./information/information_catagory', {
          title: '商业',
          pageid: 'information_catagory_page商业',
          shops: shops,
        });
      } else if (req.params.catagory == "ticket") {
        res.render('./information/information_catagory', {
          title: '机票',
          pageid: 'information_catagory_page机票',
          shops: shops,
        });
      } else {
        res.render('./information/information_catagory', {
          title: '法务',
          pageid: 'information_catagory_page法务',
          shops: shops,
        });
      }
    });
  });

  app.post('/information/get_catagory', function(req, res) {
    if(typeof(req.body.index)==='undefined') {
      var mIndex="";
      if (req.body.key==="")
      {
        res.render('./information/information_blocks', {layout: false});
      } else {
        Shops.getList_expire(req.database, mIndex, req.body.key, req.body.skip, req.body.limit, function(err, shops) {
          if (err) {
            shops = [];
          }
          res.render('./information/catagory_list', {
            layout: false,
            title: '信息',
            shops: shops
          });
        });
      }
    } else {
      var mIndex="";
      if (req.body.index == "工作") {
        mIndex = 'find_job';
      } else if (req.body.index == "找房") {
        mIndex = 'find_house';
      } else if (req.body.index == "搬家") {
        mIndex = 'move_house';
      } else if (req.body.index == "商业") {
        mIndex = 'business';
      } else if (req.body.index == "机票") {
        mIndex = 'ticket';
      } else if (req.body.index == "法务"){
        mIndex = 'law';
      }
      Shops.getList_expire(req.database, mIndex, req.body.key, req.body.skip, req.body.limit, function(err, shops) {
        if (err) {
          shops = [];
        }
        res.render('./information/catagory_list', {
          layout: false,
          title: req.body.index,
          shops: shops
        });
      });
    }
  });

  app.get('/information/:catagory/:details', function(req, res) {
    Shops.getbyUid(req.database, req.params.details, function(err, shop) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/information');
      } else {
        res.render('./information/information_details', {
          title: req.params.catagory,
          pageid: 'information_details_page',
          shop: shop,
        });
      }
    });
  });

  app.get('/remove_information', function(req, res) {
    Shops.remove(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information');
      } else {
        req.flash('success', "成功删除所有资讯");
        return res.redirect('/background/information');
      }
    });
  });

  app.get('/remove_information_buffer', function(req, res) {
    Shops_buffer.remove(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information');
      }
      req.flash('success', "成功删除所有临时资讯");
      res.redirect('/background/information');
    });
  });

  app.get('/remove_information/:uid', function(req, res) {
    Shops.removebyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information_editor_list/');
      }
      req.flash('success', "成功删除一条资讯");
      res.redirect('/background/information_editor_list/');
    });
  });

  app.get('/remove_information_buffer/:uid', function(req, res) {
    Shops_buffer.removebyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information');
      }
      req.flash('success', "成功删除一条临时资讯");
      res.redirect('/background/information');
    });
  });

  app.get('/shop_post', function(req, res) {
    res.render('./information/shop_post', {
      pageid: 'information_post_page',
      title: '投稿',
    });
  });

  app.post('/shop_post', function(req, res, next) {
    var shop = new Shops_buffer(req.body.title, req.body.content, utils.getImageString(req.files.image), req.session.user.name);
    shop.save(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/message-box');
      }
      req.flash('success', '发送已成功，我们将在一个工作日内为您完成排版制作并正式发布。');
      res.redirect('/');
    });
  });

  app.get('/user_post_view', function(req, res) {
    Posts.getAll(req.database,'', 0, 15, function(err, posts) {
      if (err) {
        posts = [];
      }
      res.render('./user_post/user_post_view', {
        title: '交流',
        pageid: 'user_post_view_page',
        posts: posts,
      });
    });
  });

  app.get('/user_post_view/:details', function(req, res) {
    Posts.getbyUid(req.database, req.params.details, function(err, post) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/user_post_view');
      }
      res.render('./user_post/user_post_details', {
        title: '交流',
        pageid: 'user_post_details_page',
        post: post,
      });
    });
  });

  app.post('/user_post_view/post_list', function(req, res) {
    Posts.getAll(req.database, req.body.key, req.body.skip, req.body.limit, function(err, posts) {
      if (err) {
        posts = [];
      }
      res.render('./user_post/post_list', {
        layout: false,
        posts: posts,
      });
    });
  });

  app.get('/post', function(req, res) {
    res.render('./user_post/post', {
      pageid: 'user_post_post_page',
      title: '个人投稿',
    });
  });

  app.get('/remove_post', function(req, res) {
    Posts.remove(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post');
      } else {
        req.flash('success', "成功删除所有免费交流");
        return res.redirect('/background/user_post');
      }
    });
  });

  app.get('/remove_post/:uid', function(req, res) {
    Posts.removebyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post_editor_list');
      }
      req.flash('success', "成功删除一条免费交流");
      res.redirect('/background/user_post_editor_list');
    });
  });

  app.get('/remove_post_buffer', function(req, res) {
    Posts_buffer.remove(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post');
      } else {
        req.flash('success', "成功删除所有临时免费交流");
        return res.redirect('/background/user_post');
      }
    });
  });

  app.get('/remove_post_buffer/:uid', function(req, res) {
    Posts_buffer.removebyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post');
      }
      req.flash('success', "成功删除一条临时免费交流");
      res.redirect('/background/user_post');
    });
  });

  app.post('/post', function(req, res) {
    var post = new Posts_buffer(req.session.user.name, req.body.location, req.body.content, req.body.contact, req.body.price, false, utils.getImageString(req.files.image));
    post.save(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/user_post_view');
      }
      req.flash('success', '发送已成功，我们将在一个工作日内为您完成排版制作并正式发布。');
      res.redirect('/user_post_view');
    });
  });

  app.get('/news', function(req, res) {
    News.getAll(req.database, 0, 15, function(err, news) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/news');
      }
      res.render('./news/news', {
        title: '时事',
        pageid: 'news_page',
        news: news,
      });
    });
  });

  app.post('/news/list', function(req, res) {
    News.getAll(req.database, req.body.skip, req.body.limit, function(err, news) {
      if (err) {
        news = [];
      }
      res.render('./news/news_list', {
        layout: false,
        news: news,
      });
    });
  });

  app.get('/news/:uid', function(req, res) {
    News.getbyUid(req.database, req.params.uid, function(err, news) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/news');
      }
      res.render('./news/news_detail', {
        title: '时事',
        pageid: 'news_details_page',
        news: news,
      });
    });
  });

  app.get('/remove_news', function(req, res) {
    News.remove(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/news');
      } else {
        req.flash('success', "成功删除所有新闻");
        return res.redirect('/background/news');
      }
    });
  });

  app.get('/remove_news/:uid', function(req, res) {
    News.removebyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/news');
      }
      req.flash('success', "成功删除一条新闻");
      res.redirect('/background/news');
    });
  });

  app.get('/learning', function(req, res) {
    res.render('./learning/learning', {
      title: '日语',
      pageid: 'learning_page',
    });
  });

  app.get('/learning/:catagory/:uid', function(req, res) {
    Learn.getbyUid(req.database, req.params.uid, function(err, learn) {
      var mTitle;
      if (req.params.catagory == "vocabulary") {
          mTitle = '常用单词';
      } else if (req.params.catagory == "beginner") {
          mTitle = '日语基础';
      } else if (req.params.catagory == "sentence") {
          mTitle = '实用语句';
      } else if (req.params.catagory == "test") {
          mTitle = '能力试验';
      } else if (req.params.catagory == "article") {
          mTitle = '初来日本';
      }
      res.render('./learning/learning_details', {
        title: mTitle,
        pageid: 'learning_details_page',
        learn: learn,
      });
    });
  });

  app.get('/learning/:learning', function(req, res) {
    Learn.getbyIndex(req.database, req.params.learning, function(err, learns) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/learning');
      }
      if (req.params.learning == "vocabulary") {
        res.render('./learning/learning_vocabulary', {
          title: '常用单词',
          pageid: 'learning_catagory_page',
          learns: learns,
        });
      } else if (req.params.learning == "beginner") {
        res.render('./learning/learning_beginner', {
          title: '日语基础',
          pageid: 'learning_catagory_page',
          learns: learns,
        });
      } else if (req.params.learning == "sentence") {
        res.render('./learning/learning_sentence', {
          title: '实用语句',
          pageid: 'learning_catagory_page',
          learns: learns,
        });
      } else if (req.params.learning == "test") {
        res.render('./learning/learning_test', {
          title: '能力试验',
          pageid: 'learning_catagory_page',
          learns: learns,
        });
      } else if (req.params.learning == "article") {
        res.render('./learning/learning_article', {
          title: '初来日本',
          pageid: 'learning_catagory_page',
          learns: learns,
        });
      }
    });
  });

  app.get('/remove_learnings', function(req, res) {
    Learn.remove(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/learning');
      } else {
        req.flash('success', "成功删除所有条目");
        return res.redirect('/background/learning');
      }
    });
  });

  app.get('/remove_learnings/:uid', function(req, res) {
    Learn.removebyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/learning');
      }
      req.flash('success', "成功删除一条");
      res.redirect('/background/learning');
    });
  });

  app.get('/favourite', function(req, res) {
    res.render('./favourite/favourite', {
      title: '收藏夹',
      pageid: 'favourite_page',
    });
  });

  app.get('/setting', function(req, res) {
    res.render('./others/setting', {
      title: '设置',
      pageid: 'settings_page',
    });
  });

  app.get('/announce', function(req, res) {
    res.render('./others/announce', {
      title: '协议和声明',
      pageid: 'announce_page',
    });
  });

  app.get('/feedback', function(req, res) {
    res.render('./others/feedback', {
      title: '意见反馈',
      pageid: 'feedback_page',
    });
  });

  app.get('/help', function(req, res) {
    res.render('./others/help', {
      title: '投稿说明',
      pageid: 'help_page',
    });
  });

  app.get('/about', function(req, res) {
    res.render('./others/about', {
      title: '简单一点',
      pageid: 'about_page',
    });
  });

  app.get('/aboutpost', function(req, res) {
    res.render('./others/aboutpost', {
      title: '联系方式',
      pageid: 'aboutpost_page',
    });
  });

  app.get('/message-box', function(req, res) {
    if (req.session.user) {
      Messages.getbyUsername(req.database, req.session.user.name, function(err, messages) {
        if (err) {
          messages = [];
        }
        res.render('./messagebox/messagebox', {
          title: '信箱',
          pageid: 'messagebox_page',
          messages: messages,
        });
      });
    } else {
      res.render('./messagebox/messagebox', {
        title: '信箱',
        pageid: 'messagebox_page',
      });
    }
  });

  app.get('/remove_messages', function(req, res) {
    Messages.remove(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      } else {
        req.flash('success', "成功删除所有消息");
        return res.redirect('/');
      }
    });
  });

  app.get('/remove_messages/:uid', function(req, res) {
    Messages.removebyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/message-box');
      }
    });
  });

  app.get('/post_selector', function(req, res) {
    res.render('./others/post_selector', {
      title: '立刻发布',
      pageid: 'post_selector_page',
    });
  });


  app.get('/reg', utils.checkNotLogin);
  app.get('/reg', function(req, res) {
    res.render('./user/reg', {
      title: '注册',
      pageid: 'reg_page',
    });
  });

  app.post('/reg', utils.checkNotLogin);
  app.post('/reg', function(req, res) {
    req.body.username = req.body.username.toLowerCase();
    if (req.body['password-repeat'] != req.body['password']) {
      req.flash('error', '你输入了两次不同的密码！');
      return res.redirect('/reg');
    }
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
      name: req.body.username,
      password: password,
    });
    User.get(req.database, newUser.name, function(err, user) {
      if (user) err = '用户已经存在';
      if (err) {
        req.flash('error', err);
        return res.redirect('/reg');
      }
      newUser.save(req.database, function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/reg');
        }
        req.session.user = newUser;
        req.flash('success', '注册成功');
        res.redirect('/');
      });
    });
  });

  app.get('/login', utils.checkNotLogin);
  app.get('/login', function(req, res) {
    res.render('./user/login', {
      title: '登入',
      pageid: 'login_page',
    });
  });

  app.post('/login', utils.checkNotLogin);
  app.post('/login', function(req, res) {
    // creating md5 Hash code
    req.body.username = req.body.username.toLowerCase();
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.get(req.database, req.body.username, function(err, user) {
      if (!user) {
        req.flash('error', '用户不存在!');
        return res.redirect('/login');
      }
      if (user.password != password) {
        req.flash('error', '密码错误！');
        return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', '登录成功！');
      res.redirect('/');
    });
  });

  app.get('/logout', utils.checkLogin);
  app.get('/logout', function(req, res) {
    req.session.user = null;
    req.flash('success', '注销成功！');
    res.redirect('/');
  });


  app.get('/u/:username', function(req, res) {
    if(req.session.user.name===req.params.username) {
      Posts.getbyUsername(req.database, req.session.user.name, function(err, posts) {
        if (err) {
          posts = [];
        }
        res.render('./user/user_post_user', {
          title: '用户投稿',
          pageid: 'user_post_user_page',
          posts: posts,
        });
      });
    }
    else {
      req.flash('error', '没有权限访问');
      return res.redirect('/post_selector/');
    }
  });

  app.get('/u/:username/:details', function(req, res) {
    Posts.getbyUid(req.database, req.params.details, function(err, post) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/u/'+req.params.username);
      }
      res.render('./user_post/user_post_details', {
        layout: false,
        post: post,
      });
    });
  });

  app.get('/u/:username/remove/:uid', function(req, res) {
    Posts.removebyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/');
      }
      req.flash('success', "已成功撤下");
      res.redirect('/');
    });
  });

  //################################################# background routing############################################
  app.get('/background', function(req, res) {
    res.render('./background/main', {
      layout: './background/background_layout',
      title: '后台管理系统',
    });
  });

  app.get('/background/news', function(req, res) {
    News.getAll(req.database, 0, 0, function(err, news) {
      res.render('./background/news', {
        layout: './background/background_layout',
        title: '后台管理系统-新闻',
        news: news,
      });
    });
  });

  app.post('/background/news', function(req, res) {
    var news = new News("", req.body.title, req.body.sub_title, req.body.source, req.body.sourceurl, req.body.newsdate, req.body.content, utils.getImageString(req.files.previmg), utils.getImageString(req.files.img));
    news.save(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/news');
      }
      req.flash('success', '发布成功');
      res.redirect('/background/news');
    });
  });

  app.get('/background/news/:uid', function(req, res) {
    News.getbyUid(req.database, req.params.uid, function(err, news) {
      res.render('./background/news_editor', {
        layout: './background/background_layout',
        title: '后台管理系统-新闻',
        news: news,
      });
    });
  });

  app.post('/background/news/:uid', function(req, res) {
    var news = new News("", req.body.title, req.body.sub_title, req.body.source, req.body.sourceurl, req.body.newsdate, req.body.content, utils.getImageString(req.files.previmg), utils.getImageString(req.files.img));
    news.modifybyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/news');
      }
      req.flash('success', '发布成功');
      res.redirect('/background/news');
    });
  });

  app.get('/background/users', function(req, res) {
    res.render('./background/users', {
      layout: './background/background_layout',
      title: '后台管理系统-用户管理',
    });
  });

  app.post('/background/users', function(req, res) {
    var message;
    message = new Messages(req.body.recv, "admin", req.body.content);
    message.save(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/users');
      }
      req.flash('success', '已成功发送消息到' + req.body.recv + '!');
      res.redirect('/background/users');
    });
  });

  app.get('/background/information', function(req, res) {
    Shops_buffer.getAll(req.database, function(err, shops) {
      if (err) {
        shops = [];
      }
      res.render('./background/information', {
        layout: './background/background_layout',
        title: '后台管理系统-实用资讯',
        shops_buffer: shops,
      });
    });
  });

  app.get('/background/information_post', function(req, res) {
    res.render('./background/information_post', {
      layout: './background/background_layout',
      title: '后台管理系统-实用资讯',
    });
  });

  app.post('/background/information_post', function(req, res, next) {
    var sIndex;
    if (req.body.index === '工作') {
      sIndex = 'find_job';
    } else if (req.body.index === '找房') {
      sIndex = 'find_house';
    } else if (req.body.index === '搬家') {
      sIndex = 'move_house';
    } else if (req.body.index === '商业') {
      sIndex = 'business';
    } else if (req.body.index === '机票') {
      sIndex = 'ticket';
    } else {
      sIndex = 'law';
    }
    var shop = new Shops(req.body.username, sIndex, req.body.title, req.body.instruction, req.body.name, req.body.brief, req.body.comment, req.body.telephone, req.body.email, req.body.url, req.body.address, req.body.path, req.body.expire, req.body.tags, req.body.prevtext, req.body.prevtext2, utils.getImageString(req.files.previmage), utils.getImageString(req.files.image));
    shop.save(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information_editor_list');
      }
      Shops_buffer.setHandled(req.database, req.params.uid, function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/background/information_editor_list');
        }
      });
      req.flash('success', '发布成功');
      res.redirect('/background/information_editor_list');
    });
  });

  app.get('/background/information/:uid', function(req, res) {
    Shops_buffer.getbyUid(req.database, req.params.uid, function(err, shop) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information');
      }
      res.render('./background/information_handle', {
        layout: './background/background_layout',
        title: '后台管理系统-实用资讯',
        shop_buffer: shop,
      });
    });
  });

  app.post('/background/information/:uid', function(req, res, next) {
    var sIndex;
    if (req.body.index === '工作') {
      sIndex = 'find_job';
    } else if (req.body.index === '找房') {
      sIndex = 'find_house';
    } else if (req.body.index === '搬家') {
      sIndex = 'move_house';
    } else if (req.body.index === '商业') {
      sIndex = 'business';
    } else if (req.body.index === '机票') {
      sIndex = 'ticket';
    } else {
      sIndex = 'law';
    }
    var shop = new Shops(req.body.username, sIndex, req.body.title, req.body.instruction, req.body.name, req.body.brief, req.body.comment, req.body.telephone, req.body.email, req.body.url, req.body.address, req.body.path, req.body.expire, req.body.tags, req.body.prevtext, req.body.prevtext2, utils.getImageString(req.files.previmage), utils.getImageString(req.files.image));
    shop.save(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information');
      }
      Shops_buffer.setHandled(req.database, req.params.uid, function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/background/information');
        }
      });
      req.flash('success', '发布成功');
      res.redirect('/background/information');
    });
  });

  app.get('/background/information_editor_list', function(req, res) {
    Shops.getAll(req.database, function(err, shops) {
      if (err) {
        shops = [];
      }
      res.render('./background/information_editor_list', {
        layout: './background/background_layout',
        title: '后台管理系统-实用资讯',
        shops: shops,
      });
    });
  });

  app.get('/background/information_editor/:uid', function(req, res) {
    Shops.getbyUid(req.database, req.params.uid, function(err, shop) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information_editor_list');
      }
      res.render('./background/information_editor', {
        layout: './background/background_layout',
        title: '后台管理系统-实用资讯',
        shop: shop,
      });
    });
  });

  app.post('/background/information_editor/:uid', function(req, res, next) {
    var sIndex;
    if (req.body.index === '工作') {
      sIndex = 'find_job';
    } else if (req.body.index === '找房') {
      sIndex = 'find_house';
    } else if (req.body.index === '搬家') {
      sIndex = 'move_house';
    } else if (req.body.index === '商业') {
      sIndex = 'business';
    } else if (req.body.index === '机票') {
      sIndex = 'ticket';
    } else {
      sIndex = 'law';
    }
    var shop = new Shops(req.body.username, sIndex, req.body.title, req.body.instruction, req.body.name, req.body.brief, req.body.comment, req.body.telephone, req.body.email, req.body.url, req.body.address, req.body.path, req.body.expire, req.body.tags, req.body.prevtext, req.body.prevtext2, utils.getImageString(req.files.previmage), utils.getImageString(req.files.image));
    shop.modifybyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information_editor_list');
      }
      Shops_buffer.setHandled(req.database, req.params.uid, function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/background/information_editor_list');
        }
      });
      req.flash('success', '发布成功');
      res.redirect('/background/information_editor_list');
    });
  });

  app.get('/background/information_editor_list_searcher', function(req, res, next) {
    Shops.getbyTele(req.database, req.query.search_key, function(err, shop) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/information_editor_list/');
      }
      res.render('./background/information_editor', {
        layout: './background/background_layout',
        title: '后台管理系统-实用资讯',
        shop: shop,
      });
    });
  });

  app.get('/background/user_post', function(req, res) {
    Posts_buffer.getAll(req.database, function(err, posts) {
      if (err) {
        posts = [];
      }
      res.render('./background/user_post', {
        layout: './background/background_layout',
        title: '后台管理系统-免费交流',
        posts_buffer: posts,
      });
    });
  });

  app.get('/background/user_post_post', function(req, res) {
    res.render('./background/user_post_post', {
      layout: './background/background_layout',
      title: '后台管理系统-免费交流',
    });
  });

  app.post('/background/user_post_post', function(req, res, next) {
    var post = new Posts(req.body.username, req.body.title, req.body.content, req.body.location, req.body.contact, req.body.price, req.body.tags, req.body.prevtext, req.body.prevtext2, utils.getImageString(req.files.previmage), utils.getImageString(req.files.image));
    post.save(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post_editor_list');
      }
      Posts_buffer.setHandled(req.database, req.params.uid, function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/background/user_post_editor_list');
        }
      });
      req.flash('success', '发布成功');
      res.redirect('/background/user_post_editor_list');
    });
  });

  app.get('/background/user_post/:uid', function(req, res) {
    Posts_buffer.getbyUid(req.database, req.params.uid, function(err, post) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post');
      }
      res.render('./background/user_post_handle', {
        layout: './background/background_layout',
        title: '后台管理系统-免费交流',
        posts_buffer: post,
      });
    });
  });

  app.post('/background/user_post/:uid', function(req, res, next) {
    var post = new Posts(req.body.username, req.body.title, req.body.content, req.body.location, req.body.contact, req.body.price, req.body.tags, req.body.prevtext, req.body.prevtext2, utils.getImageString(req.files.previmage), utils.getImageString(req.files.image));
    post.save(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post');
      }
      Posts_buffer.setHandled(req.database, req.params.uid, function(err) {
        if (err) {
          req.flash('error', err);
          return res.redirect('/background/user_post');
        }
      });
      req.flash('success', '发布成功');
      res.redirect('/background/user_post');
    });
  });

  app.get('/background/user_post_editor_list', function(req, res) {
    Posts.getAll(req.database,'', 0, 0, function(err, posts) {
      if (err) {
        posts = [];
      }
      res.render('./background/user_post_editor_list', {
        layout: './background/background_layout',
        title: '后台管理系统-免费交流',
        posts: posts,
      });
    });
  });

  app.get('/background/user_post_editor/:uid', function(req, res) {
    Posts.getbyUid(req.database, req.params.uid, function(err, post) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post_editor_list');
      }
      res.render('./background/user_post_editor', {
        layout: './background/background_layout',
        title: '后台管理系统-免费交流',
        post: post,
      });
    });
  });

  app.post('/background/user_post_editor/:uid', function(req, res, next) {
    var post = new Posts(req.body.username, req.body.title, req.body.content, req.body.location, req.body.contact, req.body.price, req.body.tags, req.body.prevtext, req.body.prevtext2, utils.getImageString(req.files.previmage), utils.getImageString(req.files.image));
    post.modifybyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post');
      }
      req.flash('success', '发布成功');
      res.redirect('/background/user_post');
    });
  });

  app.get('/background/user_post_editor_list_searcher', function(req, res, next) {
    Posts.getbyTele(req.database, req.query.search_key, function(err, post) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/user_post_editor_list/');
      }
      res.render('./background/user_post_editor', {
        layout: './background/background_layout',
        title: '后台管理系统-免费交流',
        post: post,
      });
    });
  });

  app.get('/background/learning', function(req, res) {
    Learn.getAll(req.database, function(err, learns) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/learning');
      }
      res.render('./background/learning', {
        layout: './background/background_layout',
        title: '后台管理系统-日语学习',
        learns: learns,
      });
    });
  });

  app.get('/background/learning/:uid', function(req, res) {
    Learn.getbyUid(req.database, req.params.uid, function(err, learn) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/learning');
      }
      res.render('./background/learning_editor', {
        layout: './background/background_layout',
        title: '后台管理系统-日语学习',
        learn: learn,
      });
    });
  });

  app.post('/background/learning/:uid', function(req, res, next) {
    var learn = new Learn(req.body.index, req.body.title, req.body.content, utils.getImageString(req.files.image));
    learn.modifybyUid(req.database, req.params.uid, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/learning');
      }
      req.flash('success', '修改成功');
      res.redirect('/background/learning');
    });
  });

  app.post('/background/learning', function(req, res) {
    var learn = new Learn(req.body.index, req.body.title, req.body.content, utils.getImageString(req.files.image));
    learn.save(req.database, function(err) {
      if (err) {
        req.flash('error', err);
        return res.redirect('/background/learning');
      }
      req.flash('success', '已成功发送');
      res.redirect('/background/learning');
    });
  });

  app.get('/test', function(req, res) {
    res.render('./others/test', {
      title: '字号测试',
      pageid: 'test_page',
    });
  });

  //################################################# background routing############################################
  var counter=0;
  app.post('/app_information_catagory', function(req, res){
    Shops.getList_expire(req.database, req.body.index, req.body.tags, req.body.skip, req.body.limit, function(err, shops) {
      res.json(shops);
      console.log("app_information_catagory number: "+shops.length);
    });
  });

  app.post('/app_information_details', function(req, res){
    Shops.getbyUid(req.database, req.body.uid, function(err, shop) {
      res.json(shop);
      console.log("app_information_details");
    });
  });

  app.post('/app_user_post_view', function(req, res) {
    Posts.getAll(req.database, req.body.tags, req.body.skip, req.body.limit, function(err, posts) {
      res.json(posts);
      console.log("app_user_post_view: "+posts.length);
    });   
  });
    
  app.post('/app_user_post_details', function(req, res) {
    Posts.getbyUid(req.database, req.body.uid, function(err, post) {
      res.json(post);
      console.log("app_user_post_details");
    });
  });

  app.post('/app_news',function(req, res){
    News.getAll(req.database, req.body.skip, req.body.limit, function(err, news) {
      res.json(news);
      console.log("app_news: "+news.length);
    });
  });

  app.post('/app_news_details', function(req, res){
    News.getbyUid(req.database, req.body.uid, function(err, news) {
      res.json(news);
      console.log("app_news_details");
    });
  });

  app.post('/app_learning', function(req, res){
    Learn.getbyIndex(req.database, req.body.index, function(err, learns) {
      res.json(learns);
      console.log("app_learning: "+learns.length);
    });
  });

  app.post('/app_learning_details', function(req, res){
    Learn.getbyUid(req.database, req.body.uid, function(err, learn) {
      res.json(learn);
      console.log("app_learning_details");
    });
  });

  app.post('/app_login', function(req, res) {
    // creating md5 Hash code
    var data;
    req.body.username = req.body.username.toLowerCase();
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.get(req.database, req.body.username, function(err, user) {
      if (!user) {
        data = {
          result: "error",
          message: "用户不存在!",
          username: req.body.username,
          password: req.body.password
        };
        res.json(data);
      } else if(user.password != password) {
        data = {
          result: "error",
          message: "密码错误！",
          username: req.body.username,
          password: req.body.password
        };
        res.json(data);
      } else {
        data = {
          result: "success",
          message: "登陆成功",
          username: req.body.username,
          password: req.body.password
        };
        req.session.user = user;
        res.json(data);
      }
    });
  });

  app.post('/app_reg', function(req, res) {
    var data;
    req.body.username = req.body.username.toLowerCase();
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
      name: req.body.username,
      password: password,
    });
    User.get(req.database, newUser.name, function(err, user) {
      if (user) {
        err = '用户已经存在'
      };
      if (err) {
        data = {
          result: "error",
          message: err,
          username: req.body.username,
          password: req.body.password
        };
        res.json(data);
      } else {
        newUser.save(req.database, function(err) {
          if (err) {
            data = {
              result: "error",
              message: err,
              username: req.body.username,
              password: req.body.password
            };
            res.json(data);
          }
          req.session.user = newUser;
          data = {
            result: "success",
            message: '注册成功',
            username: req.body.username,
            password: req.body.password
          };
          res.json(data);
        });
      }
    });
  });

  app.post('/app_logout', function(req, res) {
    req.session.user = null;
  });
}