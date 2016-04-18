(function($){

       $.fn.customPaginate = function(options)
       {
           var paginationContainer = this;
           var itemsToPaginate;
           
            
           var defaults = {
       
                itemsPerPage : 6
           
           };
        
           var settings = {};
        
           $.extend(settings, defaults, options);
           
           var itemsPerPage = settings.itemsPerPage;
        
           itemsToPaginate = $(settings.itemsToPaginate);
           var numberOfPaginationLinks = Math.ceil((itemsToPaginate.length / itemsPerPage));
        
           $("<ul class='uk-pagination'></ul>").prependTo(paginationContainer);
           
           for(var index = 0; index < numberOfPaginationLinks; index++)
           {
           	    if(index == 0){
                	paginationContainer.find("ul").append("<li class='uk-active'><span>"+ (index+1) + "</span></li>");
                }
                else{
                	
                paginationContainer.find("ul").append("<li><a>"+ (index+1) + "</a></li>");
                }

           }
           
           itemsToPaginate.filter(":gt(" + (itemsPerPage - 1)  + ")").hide();
           
           paginationContainer.find("ul li").first().addClass(settings.activeClass).end().on('click', function(){
                      var index = $('ul li[class="uk-active"]').text();
          $('ul li[class="uk-active"]').removeClass('uk-active').html('<a>'+index+'</a>');
			   var indexcl = $(this).text();
			  	$(this).addClass('uk-active').html("<span>"+ indexcl + "</span>")
			   var $this = $(this);
			   $this.addClass(settings.activeClass);
			   $this.siblings().removeClass(settings.activeClass);
           
               var linkNumber = $this.text();
               
                var itemsToHide = itemsToPaginate.filter(":lt(" + ((linkNumber-1) * itemsPerPage)  + ")");
                $.merge(itemsToHide, itemsToPaginate.filter(":gt(" + ((linkNumber * itemsPerPage) - 1)  + ")"));
                var itemsToShow = itemsToPaginate.not(itemsToHide);
                $("html,body").animate({scrollTop:"0px"}, function(){
                  itemsToHide.hide();
                  itemsToShow.show();
                });
           });
           
       }
            
}(jQuery));