function loadHeroItem($current_item, do_after) {
	$current_item.css('background-image', 'url(' + $current_item.data('src') + ')');
	$current_item.removeAttr('data-src');
	if (typeof do_after !== 'undefined') {
		$current_item.imagesLoaded().done( function() {
			do_after();
		});
	}
}
function loadCarouselImage($current_image, do_after) {
	$current_image.attr('src', $current_image.data('src'));
	$current_image.removeAttr('data-src');
	if (typeof do_after !== 'undefined') {
		$current_image.imagesLoaded().done( function() {
			do_after();
		});
	}
}
function loadMoreGridImages() {
	$.ajax({
		type: 'GET',
		url: window.location.pathname,
		dataType: 'html',
		data: {marker: $('.grid-item > img').last().attr('src').match(RegExp('[^/]+$'))[0]},
		success: function(data) {
			if (!data.trim() == '') {
				$new_grid_content = $(data).filter("[class~='grid-item']");
				$('.grid').append($new_grid_content);
				$new_grid_content.imagesLoaded().done( function() {
					$new_grid_content.css('visibility', 'visible');
				  $('.grid').masonry('appended', $new_grid_content);
				});
			}
		}
	})
}