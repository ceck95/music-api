$(document).ready(function(){
	$('form').submit(function(e){
		e.preventDefault();
		if($('input[name="text_search"]').val()==''){
			$('div#a').remove();
			$('.audiojs').remove();
			$('.detail').remove();
			$('ul').remove();
			$('body').append("<center><strong class='error'>Error !!!</strong></center>")
		}
		else{
		$('.error').remove();
		$('div#a').remove();
		$('.audiojs').remove();
		$('input[type="submit"]').val('Loading');
		$('.detail').remove();
		$('ul').remove();
		var keyword = $('input[name="text_search"]').val()
		var data = {};
		data.keyword = keyword;
		$.ajax({
		        type: "POST",
		        data: JSON.stringify(data),
		        contentType: 'application/json',
		        url: 'http://localhost:3000/api',
		        success:function(data)
		        {
		        	$('#wrapper').append('<strong><div class="detail">No select song</div></strong>');
		        	$('#wrapper').append('<audio preload></audio>');
		        	$('#wrapper').append('<ul class="uk-list uk-list-line">');
		        	var array = JSON.parse(data);
		           $.each(array,function(index,value){
		           	var indexOf = index+1
		           		$('ul').append('<li><strong>'+indexOf+'.</strong> <a href="#" data-src='+value.UrlJunDownload+'>'+value.Title+' - '+value.Artist+'</a><span class="uk-badge uk-float-right">Detail</span></li>');
		           });
		           $('#wrapper').append('</ul>')
		           $('input[name="text_search"]').val('');
	           	    var a = audiojs.createAll();
	           	    // auto next bai hat
	          //  	    var a = audiojs.createAll({
			        //   trackEnded: function() {
			        //     var next = $('ul li.playing').next();
			        //     if (!next.length) next = $('ul li').first();
			        //     next.addClass('playing').siblings().removeClass('playing');
			        //     audio.load($('a', next).attr('data-src'));
			        //     audio.play();
			        //   }
			        // });
				    var audio = a[0];
				    $('ul li').click(function(e) {
				      e.preventDefault();
				      $("ul li.playing strong.text-play").remove();
				      $("ul li.playing a").removeClass('color-play')
				      $(this).addClass('playing').siblings().removeClass('playing');
				      var detail = $("ul li.playing a").text();
				      $('.detail').text(detail);
				      $("ul li.playing a").addClass('color-play')
				      $("ul li.playing").append("<strong class='text-play'> (Playing) </strong>")
				      audio.load($('a', this).attr('data-src'));
				      audio.play();
				    });
				    $('body').append('<div id="pagination"></div>');
				    $('#pagination').customPaginate({
				        itemsToPaginate: 'li',
				    });
				    $('input[type="submit"]').val('Search');
		        },
		        error: function(data){
		        	console.log(data)
		        }
		    });
		}
	});

});