function loadImage($img) {
	if($img.attr('data-src')) {
		lazyLoadImage($img);
	}
	$img.parent().imagesLoaded().done( function() {
		// resize carousel image
		resizeImage($img, determineLimitingDimension());
		$img.parent().css('visibility', 'visible');
	});
	// window.location.hash = $img.attr('src').replace(/.*\//, '');
}
function lazyLoadImage($img) {
	$img.attr('src', $img.data('src'));
	$img.removeAttr('data-src');
}
function loadMoreImages($type, number) {
	$.ajax({
		type: 'GET',
		url: window.location.pathname,
		dataType: 'html',
		data: {type: $type, marker: $('.grid-item > img').last().attr('src').match(RegExp('thumbnail_.*$'))[0], number: number},
		success: function(data) {
			if(!data.trim() == '') {
				$new_grid_content = $(data).filter("[class~='grid-item']");
				$new_carousel_content = $(data).filter("[class~='carousel-item']");
				$grid.append($new_grid_content);
				$('.carousel-inner').append($new_carousel_content);
				$carousel.carousel();
				// layout Masonry after all new images load
				$grid.imagesLoaded().done( function() {
					$('.grid-item').css('visibility', 'visible');
				  $grid.masonry('appended', $new_grid_content);
				});
			}
		}
	})
}
function determineMaxImageHeight() {
	max_height = $(window).height() - parseInt($('#carousel').parent().css('padding-top'));
	return (max_height * 0.9);
}
function determineMaxImageWidth() {
	max_width = $(window).width();
	return (max_width * 0.9);
}
function determineLimitingDimension() {
	size_hash = {};
	if($(window).height() >= $(window).width()) {
		size_hash['max_width'] = determineMaxImageWidth();
	} else {
		size_hash['max_height'] = determineMaxImageHeight();
	}
	return size_hash;
}
function resizeImage($img, size_hash) {
	ratio = $img[0].height / $img[0].width;
	if('max_height' in size_hash) {
		$img.css('height', size_hash['max_height']);
		$img.css('width', size_hash['max_height'] / ratio);
	} else if('max_width' in size_hash) {
		$img.css('width', size_hash['max_width']);
		$img.css('height', size_hash['max_width'] * ratio);
	}
}
function selectRandom(array) {
  return array.eq(Math.floor(Math.random() * array.length));
}