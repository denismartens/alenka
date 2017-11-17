function loadImage($img, do_after) {
	setImageSize($img, determineLimitingDimension());
	$img.attr('src', $img.data('src'));
	$img.removeAttr('data-src');
	if(typeof do_after !== 'undefined') {
		$img.imagesLoaded().done( function() {
			do_after();
			// window.location.hash = $img.attr('src').replace(/.*\//, '');
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
			if(!data.trim() == '') {
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
function loadMoreCarouselImages() {
	$marker = $('.carousel-item > img').last()
	$.ajax({
		type: 'GET',
		url: window.location.pathname,
		dataType: 'html',
		data: {marker: ($marker.attr('data-src') || $marker.attr('src')).match(RegExp('[^/]+$'))[0]},
		success: function(data) {
			if(!data.trim() == '') {
				$new_carousel_content = $(data).filter("[class~='carousel-item']");
				$('.carousel-inner').append($new_carousel_content);
				$('#carousel').carousel();
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
function setImageSize($img, size_hash) {
	ratio = $img[0].height / $img[0].width;
	if('max_height' in size_hash) {
		$img.css('height', size_hash['max_height']);
		$img.css('width', size_hash['max_height'] / ratio);
	} else if('max_width' in size_hash) {
		$img.css('width', size_hash['max_width']);
		$img.css('height', size_hash['max_width'] * ratio);
	}
}