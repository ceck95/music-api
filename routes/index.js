var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require('cheerio');
var htmlToJson = require('html-to-json');
// var $ = require('jQuery');
//how to use jquery
var jsdom = require("jsdom");
// (function () {
//   'use strict';
// jsdom.env({
//   url: "http://news.ycombinator.com/",
//   scripts: ["http://code.jquery.com/jquery.js"],
//   done: function (err, window) {
//     var $ = window.$;
//     console.log("HN Links");
//     // $("td.title:not(:last) a").each(function() {
//     //   console.log(" -", $(this).text());
//     // });
//   }
// });
//end
//   var env = require('jsdom').env
//     , html = '<html><body><h1>Hello World!</h1><p class="hello">Heya Big World!</body></html>'
//     ;

//   // first argument can be html string, filename, or url
//   env(html, function (errors, window) {
//     console.log(errors);

//     var $ = require('jquery')(window)
//       ;

//     console.log($('.hello').text());
//   });
// }());
// var db = require('../db');

// var Query = db.model('Query', {
// 	keyword: String,
// 	created: { type: Date, default: new Date() }
// });


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'music.nhutuit.com - NhutUIT' });
});
router.post('/api', function(req,res) {
	var json = JSON.parse(JSON.stringify(req.body));
	var data = json.keyword
	// console.log(data)
	// var q = new Query({ keyword: data });
	// q.save();
	// console.log(q)

	var s = Math.floor((Math.random()* 10) + 1);
	var options = { method: 'GET',
	  url: 'http://jginggong.nhutuit.com/jOut.ashx',
	  qs: 
	   { code: s,
	     k: data,
	     h: 'nhaccuatui.com' 
	 	}
	 };
	request(options, function (error, response, body) {
	  if (error) throw new Error(error);
	  else {
		  // res.setHeader('Content-Type', 'application/json');
		  // var a = JSON.parse(req.body);
		 //  var key, count = 0;
			// for(key in a) {
			//   if(a.hasOwnProperty(key)) {
			//     count++;
			//   }
			// }
		 //  console.log(count);
		 //  var output;
		 //  for(var i = 0;i < count;i++){
		 //  	console.log(a[i].Title);
		 //  }
		  // var json2html = require('node-json2html');
		  // var transform = {'tag':'div',children:[{'tag':'strong','html': '${Title} <a href="${UrlJunDownload}">Play</a></br>'}]};
		  // // var html = json2html.transform(a,transform);
		  // console.log(a)
		  // res.locals =  {api: a};
		  // res.send(html);
		  //render has partials
		  // res.render(
		  //   'api',
		  //   {
		  //     partials:
		  //     {
		  //       layout: 'layout',
		  //     }
		  //   }
		  // );
		  // res.render('api');
		  res.send(body);
	  }
	});

});
router.get('/search/:textSearch',function(req,res){
	var nameSearch = req.params.textSearch;
	var s = Math.floor((Math.random()*10)+1);
	var options = {method: 'GET',

	url: 'http://jginggong.nhutuit.com/jOut.ashx',
	qs:
	{
		code: s,
		k: nameSearch,
		h:'nhaccuatui.com'
	} 

};
request(options,function(error,response,body){
	if (error) throw new Error(error);
	else{
		res.setHeader('Content-Type', 'application/json');
		res.send(body);
	}
});

});


router.get('/mv',function(req,res){
	var tenmv = req.query.tenmv;
	// console.log(tenmv);
	// var s = Math.floor((Math.random()*10)+1);
	var options = {method: 'GET',
	headers: 
	{
		'User-Agent': 'Super Agent/0.0.1',
		'Content-Type': 'text/html;charset=UTF-8'
	},
	url: 'http://m.nhaccuatui.com/tim-kiem/mv',
	qs:
	{
		q: tenmv
	} 

};
request(options,function(error,response,body){
	if (error) throw new Error(error);
	else{
		// res.setHeader('Content-Type', 'application/json');
		var $ = cheerio.load(body);
		var a = $('.note-Result').text();
		var c = a.indexOf("mv");
		var bd = a.indexOf("/");
		var b = a.substring(bd+1,c);
		// console.log(b)
		var somv = parseInt(b);
		// console.log(somv);
		if(somv <= 10){
			var options = {
				method: "GET",
				url: "http://m.nhaccuatui.com/tim-kiem/mv",
				qs: {
					q: tenmv
				}
			}
			request(options,function(error,response,body){
				if (error) throw new Error(error);
				else{
					var content = $('.search').html();
					htmlToJson.parse(content, function () {
					  return this.map('.row', {
					  'TenMV': function ($name) {	
					    return $name.find('.txt-80 a').text();
					  },
					  'CaSi': function ($cs) {	
					    return $cs.find('.txt-80 img').attr('alt');
					  },
					 'ImageMV': function ($cs) {
					    return $cs.find('.img-80 a img').attr('src');
					  },
					  'Listener': function ($cs){
					  	return $cs.find('.txt-80 span').text();
					  },
					  'LinkMV': function ($cs) {	
					  	var vitri = $cs.find('.img-80 a').attr('href');
					  	var len = vitri.length;;
					  	var url = vitri.substring(30,len-5);
					  	var kitu = url.indexOf(".");
					  	var dodai = url.length;
					  	var code = url.substring(kitu+1,dodai);
					  	var urlhost = req.protocol + '://' + req.get('host');
					    return urlhost+"/xemvideo/"+code;
					  },
					});
					}).done(function (items) {
					  res.json(items); 
					}, function (err) {
					  res.json({'status':'Not found'});
					});
					// res.send(content);
				}
			});
		}
		else{
			var numberpage = 3;
			var html = [];
			for(var i = 1 ;i<= numberpage ; i++){
				// console.log(i);
				var options = {
					method: "GET",
					url: "http://m.nhaccuatui.com/tim-kiem/mv",
					qs:{
						q: tenmv,
						page: i
					}
				}
				function callback (error,response,body){
					if (error) throw new Error(error);
					else{
						var content = $('.search').html();
						return content;
					}
				}
				var tag = request(options,callback);
				console.log(callback());
				html.push(callback());
			}
			var content;
			for (var i = 0 ; i< html.length ; i++){
				content += html[i];
			}
			// var content = html[0]+html[1];
			htmlToJson.parse(content, function () {
			  return this.map('.row', {
			  'TenMV': function ($name) {	
			    return $name.find('.txt-80 a').text();
			  },
			  'CaSi': function ($cs) {	
			    return $cs.find('.txt-80 img').attr('alt');
			  },
	  		 'Listener': function ($cs){
			  	var listener =  $cs.find('.txt-80 span').text();
			  	var sum = listener.trim();
			  	return sum;
			  },
			 'ImageMV': function ($cs) {
			    return $cs.find('.img-80 a img').attr('src');
			  },
			  'LinkMV': function ($cs) {	
			  	var vitri = $cs.find('.img-80 a').attr('href');
			  	var len = vitri.length;;
			  	var url = vitri.substring(30,len-5);
			  	var kitu = url.indexOf(".");
			  	var dodai = url.length;
			  	var code = url.substring(kitu+1,dodai);
			  	var urlhost = req.protocol + '://' + req.get('host');
			    return urlhost+"/xemvideo/"+code;
			  },
			});
			}).done(function (items) {
			  res.json(items); 
			}, function (err) {
			  res.json({'status':'Not found'});
			});
		}

	}
});
});


router.get('/xemvideo/:link',function(req,res){
	var code = req.params.link;
	res.redirect('http://www.nhaccuatui.com/mv/xem-clip/'+code);
});
router.post('/apimv',function(req,res){
	var url = req.protocol + '://' + req.get('host');
	// console.log(url);
	var data = JSON.parse(JSON.stringify(req.body));
	var namevideo = data.name;
	var options = {
		method: 'GET',
		url: url+'/mv',
		qs:{
			tenmv: namevideo,
		}
	};
	request(options,function(error,response,body){
		if (error) throw new Error(error);
		else{
			res.send(body)
		}
	});
});
router.get('/searchmv/:textSearch',function(req,res){
	var url = req.protocol + '://' + req.get('host');
	var nameSearch = req.params.textSearch;
	var options = {method: 'GET',
		url: url+'/mv',
		qs:
		{
			tenmv: nameSearch,
		} 
	};
	request(options,function(error,response,body){
		if (error) throw new Error(error);
		else{
			res.setHeader('Content-Type', 'application/json');
			res.send(body);
		}
	});
});
module.exports = router;
