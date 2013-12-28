var fs = require('fs');
module.exports = utils;

function utils(){
// empty
};

utils.isArray = function isArray(arr) {
	return Object.prototype.toString.call(arr) === "[object Array]";
};

utils.getImageString = function getImageString(images) {
	if (images.size !== 0) {
		if (utils.isArray(images)) {
			var sImgs = new Array(images.length);
			for (var i = 0; i < images.length; i++) {
				var sImgBase64 = fs.readFileSync(images[i].path, 'base64');
				sImgBase64 = sImgBase64.replace(/^data:image\/jpg;base64,/, "");
				sImgs[i] = sImgBase64;
			}
			return sImgs;
		} else {
			var sImgBase64 = fs.readFileSync(images.path, 'base64');
			sImgBase64 = sImgBase64.replace(/^data:image\/jpg;base64,/, "");
			return sImgBase64;
		}
	} else {
		return "";
	}
};

utils.checkLogin = function checkLogin(req, res, next) {
	if (!req.session.user) {
		req.flash('error', '需要登陆才能继续！');
		return res.redirect('/login');
	}
	next();
};

utils.checkNotLogin = function checkNotLogin(req, res, next) {
	if (req.session.user) {
		req.flash('error', '已经登陆');
		return res.redirect('/');
	}
	next();
};

utils.appcheckLogin = function checkLogin(req, res, next) {
	if (!req.session.user) {
		var data = {
			result: 'error',
			message: '需要登陆才能继续！'
		};
		res.json(data);
	}
	next();
};

utils.appcheckNotLogin = function checkNotLogin(req, res, next) {
	if (req.session.user) {
		var data = {
			result: 'error',
			message: '已经登陆'
		};
		res.json(data);
	}
	next();
};

utils.distinct = function distinct(objects) {
	var mObjects=[];
	objects.forEach(function(object, index){
		var flag=true;
		try {
			mObjects.forEach(function(mObject, index){
				if (object.sub_index=== mObject.sub_index) {
					flag=false;
					throw 1;
				}
			});
		} catch (e) { 
		}
		if (flag){
			mObjects.push(object);
		}
	});
	return mObjects;
};

utils.checkExpire = function checkExpire(datetime)
{
	if(Date.parse(datetime)<Date.parse(new Date())) {
		return false;
	}
	else return true;
};