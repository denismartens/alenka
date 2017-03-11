$(document).ready(function(e) {
	current_img_src = selectRandom($('.item > img')).attr('data-src');
	loadCarousel(current_img_src);
});