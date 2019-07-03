jQuery.fn.carousel.Constructor.TRANSITION_DURATION = 1500;
var carousel;
function initCarousel($current_item, interval) {
	$current_item.addClass('active');
	carousel = $('#carousel').carousel({
		interval: interval
	});
	$current_item.css('visibility', 'visible');
	$('.carousel-control').each( function() {
		$(this).find('glyphicon').css('top', '50%');
	});
	carousel.on('slide.bs.carousel', function(e) {
		$current_item = $('.carousel-item').eq(e.to);
		if (window.location.pathname === '/') {
			loadHeroImage($current_item, function() { $current_item.css('visibility', 'visible')});
		} else {
			loadCarouselImage($current_item.find('img').eq(0), function() { $current_item.css('visibility', 'visible')});
		}
	});
	carousel.on('slid.bs.carousel', function (e) {
		$current_item = $('.carousel-item').eq(e.to + 1);
		if (window.location.pathname === '/') {
			loadHeroImage($current_item);
		} else {
			loadCarouselImage($current_item.find('img').eq(0));
		}
	});
	$(document).bind('keyup', function(e) {
		if(e.which == 39){
			carousel.carousel('next');
		} else if(e.which == 37){
			carousel.carousel('prev');
		}
	});
}
function hideCarousel() {
	carousel.carousel('dispose');
	$('.carousel-item.active').eq(0).removeClass('active');
}