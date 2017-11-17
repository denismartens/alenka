// layout Masonry after all images load
$(document).ready(function() {
	$('.grid').imagesLoaded().done( function() {
		// init Masonry
		$('.grid').masonry({
		  itemSelector: '.grid-item',
		  fitWidth: true,
		  columnWidth: '.grid-item',
		  gutter: 16,
		  transitionDuration: '0.7s'
		});
		$('.grid-item').css('visibility', 'visible');
	});
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			loadMoreGridImages();
			loadMoreCarouselImages();
		}
	});
	$(document).on('click', '.grid-item > img', function() {
		current_img_src = $(this).attr('src').replace('thumbnail_','');
		$current_img = $(".carousel-item > img[data-src='" + current_img_src + "'], .carousel-item > img[src='" + current_img_src + "']").eq(0);
		loadImage($current_img, initCarousel($current_img));
	});
	$('.modal').on('show.bs.modal', function() {
		window.location.hash = 'image';
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