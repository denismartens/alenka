function loadImage($img) {
	if($img.attr('data-src')) {
		lazyLoadImage($img);
	}
	$img.parent().imagesLoaded().done( function() {
		// resize carousel image if necessary
		if($img[0].height > $(window).height() * 0.90) {
			resizeImage($img);
		}
		$img.parent().css('visibility', 'visible');
	});
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
function resizeImage($img) {
	ratio = $img[0].height / $img[0].width;
	adjusted_height = $(window).height() * 0.90;
	adjusted_width = adjusted_height / ratio;
	$img.css('height',adjusted_height);
	$img.css('width',adjusted_width);
}
function selectRandom(array) {
  return array.eq(Math.floor(Math.random() * array.length));
}