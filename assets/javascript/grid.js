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
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			$('.grid').imagesLoaded().done( function() {
				loadMoreGridImages();
			})
		}
	});
});