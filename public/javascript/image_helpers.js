function loadImage($img) {
	if($img.attr('data-src')) {
		lazyLoadImage($img);
	}
	$img.parent().imagesLoaded().done( function() {
		// resize carousel image if necessary
		size_hash = determineDesiredImageSize($img);
		if($img[0].height != size_hash['new_height'] || $img[0].width != size_hash['new_width']) {
			resizeImage($img, size_hash);
		}
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
				$new_carousel_content = $(data).filter("[class~='item']");
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
function determineDesiredImageSize($img) {
	size_hash = {};
	if($(window).height() >= $(window).width()) {
		ratio = $img[0].width / $img[0].height;
		size_hash['new_width'] = determineMaxImageWidth();
		size_hash['new_height'] = size_hash['new_height'] / ratio;
	} else {
		ratio = $img[0].height / $img[0].width;
		size_hash['new_height'] = determineMaxImageHeight();
		size_hash['new_width'] = size_hash['new_height'] / ratio;
	}
	return size_hash;
}
function resizeImage($img, size_hash) {
	$img.css('height', size_hash['new_height']);
	$img.css('width', size_hash['new_width']);
}
function selectRandom(array) {
  return array.eq(Math.floor(Math.random() * array.length));
}