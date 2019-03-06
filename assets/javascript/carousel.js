jQuery.fn.carousel.Constructor.TRANSITION_DURATION = 1500;
function initCarousel($current_item) {
	$current_item.addClass('active');
	if ($('.modal').length) { $('.modal').modal('show'); }
	$('#carousel').carousel({
		interval: 8000,
		pause: false
	});
	$current_item.css('visibility', 'visible');
	$('.carousel-control').each( function() {
		$(this).find('glyphicon').css('top', $current_item.height() * 0.5 + parseInt($('#carousel').css('padding-top')));
		$(this).css('visibility', 'visible');
	});
}
function hideCarousel() {
	$('#carousel').carousel('pause');
	$('.carousel-item.active').eq(0).removeClass('active');
}
$(document).ready(function() {
	$('#carousel').on('slide.bs.carousel', function(e) {
		$current_item = $(e.relatedTarget).eq(0);
		loadImage($current_item, function() { $current_item.css('visibility', 'visible'); });
	});
	$('#carousel').on('slid.bs.carousel', function (e) {
		loadImage($(e.relatedTarget).next().eq(0));
		if($(e.relatedTarget).next().index() == ($('.carousel-item').length - 1)) {
			loadMoreCarouselImages();
		}
	});
	$(document).bind('keyup', function(e) {
		if(e.which == 39){
			$('#carousel').carousel('next');
		} else if(e.which == 37){
			$('#carousel').carousel('prev');
		}
	});
	// $(window).resize(function() {
	// 	$('.carousel-item.active > img[src]').each(function() {
	// 		if($('.modal-dialog').length) {$('.modal-dialog').eq(0).css('height',$(window).height() * 0.9);}
	// 		setImageSize($(this), determineLimitingDimension());
	// 	});
	// 	$('.carousel-control .glyphicon').each( function() {
	// 		$(this).css('top',$('#carousel').height() * 0.5 + parseInt($('#carousel').css('padding-top')));
	// 	});
	// });
});