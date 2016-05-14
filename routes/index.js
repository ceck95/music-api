var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require('cheerio');
var htmlToJson = require('html-to-json');
// var $ = require('jQuery');
//how to use jquery
var jsdom = require("jsdom");
var rp = require('request-promise');
var HttpsProxyAgent = require('http-proxy-agent');
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
	var urlhost = req.protocol + '://' + req.get('host');
	var options = { method: 'GET',
	  url: urlhost+"/mp3",
	  qs: 
	   { tensong: data, 
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
	var urlhost = req.protocol + '://' + req.get('host');
	var options = { method: 'GET',
	  url: urlhost+"/mp3",
	  qs: 
	   { tensong: nameSearch, 
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
		var $ = cheerio.load(body);
		var a = $('.note-Result').text();
		var c = a.indexOf("mv");
		var bd = a.indexOf("/");
		var b = a.substring(bd+1,c);
		var somv = parseInt(b);
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
				}
			});
		}
		else{
			var numberpage = 3;
			var html = [];
			for(var i = 1 ;i<= numberpage ; i++){
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
				html.push(callback());
			}
			var content;
			for (var i = 0 ; i< html.length ; i++){
				content += html[i];
			}
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
router.get('/mp3',function(req,res){
	var tensong = req.query.tensong;
			var numberpage = 3;
			var html = [];

			(function next(page) {
				if (page == numberpage + 1) {
					var content = html.join(' ');
					// var $ = cheerio.load(content);
					// var arraylink = [];
					// console.log($('.bgmusic').length)
					// $('.bgmusic').each(function(i, elem) {
					//   	var text = $(this).find('h3 a').attr('href');
					//   	var gettext = text.substring(32,text.length);
					//   	var bd = gettext.indexOf('.');
					//   	var link = gettext.substring(bd+1,gettext.length-5);
					//   	var url = req.protocol + '://' + req.get('host');
					//   	arraylink[i] = url+'/bai-hat/'+gettext;

					// });
					// console.log( arraylink.length);
					// var html2 = [];
					// (function tiep(num){
					// 	if(num == arraylink.length){
					// 		var content2 = html2.join(' ');
					// 		res.send(content2);
					// 	}
					// 	else{
					// 	var options1 = {
					// 		method:"GET",
					// 		url:arraylink[num]
					// 	}
					// 	rp(options1).then(function (body) {
					// 		console.log(num);
					//        html2.push(body);
					//        tiep(num + 1);
					//     })
					//     .catch(function (err) {
					//         console.log(err);
					//     });
					// 	}
					// })(0);
					htmlToJson.parse(content, function () {
					  return this.map('.bgmusic ', {
					  'TenSong': function ($name) {	
					    return $name.find('h3 a').text();
					  },
					  'CaSi': function ($cs) {	
					    return $cs.find('p img').attr('alt');
					  },
			  		 'Listener': function ($cs){
					  	var listener =  $cs.find('p span img').attr('alt');
					  	var  getlistener = listener.substring(0,listener.length - 10);
					  	return getlistener;
					  },
					  'LinkSong': function ($cs) {	
					  	var text = $cs.find('h3 a').attr('href');
					  	var gettext = text.substring(32,text.length);
					  	var bd = gettext.indexOf('.');
					  	var link = gettext.substring(bd+1,gettext.length-5);
					  	var url = req.protocol + '://' + req.get('host');
						return url+'/download/song/'+gettext;
						// return url+'test/bai-hat/'+gettext;

						// var async = require('asyncawait/async');
						// var await = require('asyncawait/await');

						// var data_test = async (function() {
						// 	function getData() {
						// 		return new Promise(function(resolve, reject) {
						// 			var options2 = {
						// 				method:"GET",
						// 				url: url+"/test/bai-hat/"+gettext
						// 			}
						// 			request(options2, function(error, response, body) {
						// 				quote = body;
						// 				resolve(quote);
						// 			})
						// 		});
						// 	}

						// 	return await getData();
						// });

						// return data_test;

					  },
					});
					}).done(function (items) {
					  res.json(items); 
					}, function (err) {
					  res.json({'status':'Not found'});
					});
					return;
				}

				var options = {
					method: "GET",
					url: "http://m.nhaccuatui.com/tim-kiem/bai-hat",
					qs:{
						q: tensong,
						page: page
					}
				};

				rp(options).then(function (body) {
			       html.push(body);
			       next(page + 1);
			    })
			    .catch(function (err) {
			        console.log(err);
			    });

			})(1);
});
router.get("/download/song/:songName",function(req,res){
	var songname = req.params.songName;
	var options = {
		method: "GET",
		url:"http://www.nhaccuatui.com/bai-hat/"+songname
	}
	request(options,function(error,response,body){
			if (error) throw new Error(error);
			else{
				// var data = JSON.parse(body);
				// res.setHeader('Content-Type', 'application/json');
				// console.log('test',data.error_message);
				// res.redirect(data.data.stream_url);
				var test = body.indexOf('http://www.nhaccuatui.com/flash/xml?html5=true&key1=');
				var test2 = body.indexOf('player.peConfig.defaultIndex');
				var text = body.substring(test,test2);
				var gettext = text.indexOf('\n');
				var link = text.substring(0,gettext-2);
				var options = {
					method:"GET",
					// headers: 
					// {
					// 	'User-Agent': 'Super Agent/0.0.1',
					// 	'Content-Type': 'text/html;charset=UTF-8'
					// },
					url:link
				};
				request(options,function(error,response,body){
					if (error) throw new Error(error);
					else{
						var $ = cheerio.load(body);
						var textmp3= $('location').html();
						var mp3 = textmp3.substring(textmp3.indexOf('http://'),textmp3.indexOf('.mp3')+4);
						res.redirect(mp3);
					}
				});
			}
	});
});
router.get("/test/bai-hat/:songName",function(req,res){
	var songname = req.params.songName;
	var options = {
		method: "GET",
		url:"http://www.nhaccuatui.com/bai-hat/"+songname
	}
	request(options,function(error,response,body){
			if (error) throw new Error(error);
			else{
				// var data = JSON.parse(body);
				// res.setHeader('Content-Type', 'application/json');
				// console.log('test',data.error_message);
				// res.redirect(data.data.stream_url);
				var test = body.indexOf('http://www.nhaccuatui.com/flash/xml?html5=true&key1=');
				var test2 = body.indexOf('player.peConfig.defaultIndex');
				var text = body.substring(test,test2);
				var gettext = text.indexOf('\n');
				var link = text.substring(0,gettext-2);
				var options = {
					method:"GET",
					headers: 
					{
						'User-Agent': 'Super Agent/0.0.1',
						'Content-Type': 'text/html;charset=UTF-8'
					},
					url:link
				};
				request(options,function(error,response,body){
					if (error) throw new Error(error);
					else{
						res.send(body)
					}
				});
			}
	});
});
router.get("/jav",function(req,res){
	var id = req.query.id;
	var options = {
		method: "GET",
		url: "http://javhd.com/en/id/"+id
	}
	rp(options).then(function(body){
		var $ = cheerio.load(body);
		var hd = $('#report-body .sample img').attr('src');
		var gethd = hd.substring(29,hd.indexOf('-p/images'));
		res.send(gethd);
	})
});
module.exports = router;
