// layout Masonry after all images load
var $grid = $('.grid').imagesLoaded().done( function() {
	$('.grid-item').css('visibility', 'visible');
	// init Masonry
	$grid.masonry({
	  itemSelector: '.grid-item',
	  fitWidth: true,
	  columnWidth: '.grid-item',
	  gutter: 16,
	  transitionDuration: '0.7s'
	});
});
$(window).scroll(function() {
	if($(window).scrollTop() + $(window).height() == $(document).height()) {
		loadMoreImages('all', 25);
	}
});
$(document).on('click', '.grid-item > img', function() {
	current_img_src = $(this).attr('src').replace('thumbnail_','');
	loadCarousel(current_img_src);
});
var $modal = $('.modal');
$modal.on('show.bs.modal', function() {
	window.location.hash = 'image';
	window.onhashchange = function() {
		if(!location.hash){
			$modal.modal('hide');
		}
	}
});
$(document).bind('keyup', function(e) {
	if(e.which == 8){
		$modal.modal('hide');
		window.location.hash = '';
	}
});
$modal.on('hidden.bs.modal', function() {
	window.location.hash = '';
	hideCarousel();
});