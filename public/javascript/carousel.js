var $carousel = $('#carousel');
function loadCarousel(active_img_src) {
	$current_img = $(".item > img[data-src='" + current_img_src + "'], .item > img[src='" + current_img_src + "']").eq(0);
	$current_img.parent().addClass('active');
	$('.carousel-control .glyphicon').each( function() {
		$(this).css('top',$(window).height() * 0.9 * 0.5);
	});
	$('.modal').modal('show');
	loadImage($current_img);
	$carousel.carousel({
		interval: 5500,
		pause: null
	});
}
function hideCarousel() {
	$carousel.carousel('pause');
	$('.item.active').eq(0).removeClass('active');
}
$carousel.on('slide.bs.carousel', function(e) {
	$current_img = $(e.relatedTarget).find('img').eq(0);
	loadImage($current_img);
})
$carousel.on('slid.bs.carousel', function (e) {
	$next_img = $(e.relatedTarget).next().find('img').eq(0);
	// load next image
	lazyLoadImage($next_img);
	if(($(e.relatedTarget).index() + 1) % 15 == 0) {
		loadMoreImages('carousel', 5);
	}
});
$(document).bind('keyup', function(e) {
	if(e.which == 39){
		$carousel.carousel('next');
	}
	else if(e.which == 37){
		$carousel.carousel('prev');
	}
});
$(window).resize(function() {
	$('.carousel-control .glyphicon').each( function() {
		$(this).css('top',$(window).height() * 0.9 * 0.5);
	});
	$('.item > img[src]').each(function() {
		$('.modal-dialog').eq(0).css('height',$(window).height() * 0.90);
		resizeImage($(this));
	});
});