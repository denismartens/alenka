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
	// $(document).on('click', '.grid-item > img', function() {
	// 	current_img_src = $(this).attr('src').replace('thumbnail_','');
	// 	$current_img = $(".carousel-item > img[data-src='" + current_img_src + "'], .carousel-item > img[src='" + current_img_src + "']").eq(0);
	// 	loadImage($current_img, initCarousel($current_img));
	// });
});