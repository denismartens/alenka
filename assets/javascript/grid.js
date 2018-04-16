// layout Masonry after all images load
$(document).ready(function() {
	$('.grid').imagesLoaded().done( function() {
		// init Masonry
		$('.grid').masonry({
		  itemSelector: '.grid-item',
		  percentPosition: true,
		  columnWidth: '.grid-item',
		  gutter: 16,
		  transitionDuration: '0.7s',
		  horizontalOrder: true
		});
		$('.grid-item').css('visibility', 'visible');
	});
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			loadMoreGridImages();
		}
	});
});