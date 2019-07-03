function loadHeroImage($current_image, do_after) {
	if ($current_image.css('background-image') === 'none') {
		$current_image.css('background-image', 'url(' + $current_image.data('src') + ')');
	}
	if (do_after !== undefined) {
		$current_image.imagesLoaded().done( function() {
			do_after();
		});
	}
}
function loadCarouselImage($current_image, do_after) {
	if ($current_image.attr('src') === undefined) {
		$current_image.attr('src', $current_image.data('src'));
	}
	if (do_after !== undefined) {
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