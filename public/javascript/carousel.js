jQuery.fn.carousel.Constructor.TRANSITION_DURATION = 1500;
var $carousel = $('#carousel');
function loadCarousel(active_img_src) {
	$current_img = $(".carousel-item > img[data-src='" + current_img_src + "'], .carousel-item > img[src='" + current_img_src + "']").eq(0);
	$current_img.parent().addClass('active');
	if ($('.modal').length) { $('.modal').modal('show'); }
	loadImage($current_img);
	$carousel.carousel({
		interval: 8000,
		pause: false
	});
	$current_img.imagesLoaded().done( function() {
		$('.carousel-control').each( function() {
			$(this).find('glyphicon').css('top', $current_img.height() * 0.5 + parseInt($carousel.css('padding-top')));
			$(this).css('visibility', 'visible');
		});
	});
}
function hideCarousel() {
	$carousel.carousel('pause');
	$('.carousel-item.active').eq(0).removeClass('active');
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
	} else if(e.which == 37){
		$carousel.carousel('prev');
	}
});
$(window).resize(function() {
	$('.carousel-item.active > img[src]').each(function() {
		if($('.modal-dialog').length) {$('.modal-dialog').eq(0).css('height',$(window).height() * 0.9);}
		setImageSize($(this), determineLimitingDimension());
	});
	$('.carousel-control .glyphicon').each( function() {
		$(this).css('top',$carousel.height() * 0.5 + parseInt($carousel.css('padding-top')));
	});
});