jQuery.fn.carousel.Constructor.TRANSITION_DURATION = 1500;
function initCarousel($current_item) {
	$current_item.addClass('active');
	$('#carousel').carousel({
		interval: 8000,
		pause: false,
		ride: true
	});
	$current_item.css('visibility', 'visible');
	if (window.location.pathname !== '/') {
		$('.modal').modal('show');
	}
	$('.carousel-control').each( function() {
		$(this).find('glyphicon').css('top', '50%');
	});
}
function hideCarousel() {
	$('#carousel').carousel('pause');
	$('.carousel-item.active').eq(0).removeClass('active');
}
$(document).ready(function() {
	$('#carousel').on('slide.bs.carousel', function(e) {
		$current_item = $(e.relatedTarget);
		if (window.location.pathname === '/') {
			loadHeroItem($current_item, function() { $current_item.css('visibility', 'visible'); });
		} else {
			loadCarouselImage($current_item.find('img').eq(0), function() { $current_item.css('visibility', 'visible'); });
		}
	});
	$('#carousel').on('slid.bs.carousel', function (e) {
		if (window.location.pathname === '/') {
			loadHeroItem($(e.relatedTarget));
		} else {
			loadCarouselImage($(e.relatedTarget).find('img').eq(0));
		}
	});
	$(document).bind('keyup', function(e) {
		if(e.which == 39){
			$('#carousel').carousel('next');
		} else if(e.which == 37){
			$('#carousel').carousel('prev');
		}
	});
});