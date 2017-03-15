$(document).ready(function(e) {
	current_img_src = selectRandom($('.carousel-item > img')).attr('data-src');
	loadCarousel(current_img_src);
});