// layout Masonry after all images load
$(document).ready(function() {
	$('.grid').imagesLoaded().done( function() {
		// init Masonry
		$('.grid').masonry({
			itemSelector: '.grid-item',
			columnWidth: '.grid-item',
			gutter: '.gutter',
			transitionDuration: '0.7s',
			percentPosition: true,
			horizontalOrder: true,
			containerStyle: null
		});
		$('.grid-item').css('visibility', 'visible');
	});
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height() && window.location.pathname !== '/') {
			$('.grid').imagesLoaded().done( function() {
				loadMoreGridImages();
			})
		}
	});
	$(document).on('click', '.grid-item > img', function() {
		current_img_src = $(this).attr('src').replace('/thumbnails', '/slides');
		$current_item = $(".carousel-item > img[data-src=\"" + current_img_src + "\"], .carousel-item > img[src=\"" + current_img_src + "\"]").eq(0);
		loadCarouselImage($current_item, initCarousel($current_item.parent()));
	});
	$('.modal').on('show.bs.modal', function() {
		window.location.hash = 'slides';
		window.onhashchange = function() {
			if(!location.hash){
				$('.modal').modal('hide');
			}
		}
	});
	$(document).bind('keyup', function(e) {
		if(e.which == 8){
			$('.modal').modal('hide');
			window.location.hash = '';
		}
	});
	$('.modal').on('hidden.bs.modal', function() {
		window.location.hash = '';
		hideCarousel();
	});
});