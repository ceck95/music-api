var express = require('express');
var router = express.Router();
var request = require("request");
// var db = require('../db');

// var Query = db.model('Query', {
// 	keyword: String,
// 	created: { type: Date, default: new Date() }
// });


/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'music.nhutuit.com' });
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


module.exports = router;
