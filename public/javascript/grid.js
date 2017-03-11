// layout Masonry after all images load
var $grid = $('.grid').imagesLoaded().done( function() {
	$('.grid-item').css('visibility', 'visible');
	// init Masonry
	$grid.masonry({
	  itemSelector: '.grid-item',
	  fitWidth: true,
	  columnWidth: 350,
	  gutter: 16,
	  transitionDuration: '0.7s'
	});
});
$(window).scroll(function() {
	if($(window).scrollTop() + $(window).height() == $(document).height()) {
		loadMoreImages('all', 15);
	}
});
$(document).on('click', '.grid-item > img', function(e) {
	current_img_src = $(this).attr('src').replace('thumbnail_','');
	loadCarousel(current_img_src);
});
$('.modal').on('hidden.bs.modal', function (e) {
	hideCarousel();
});