// layout Masonry after all images load
document.addEventListener('DOMContentLoaded', () => {
	document.querySelector('.grid').imagesLoaded().done( function() {
		// init Masonry
		document.querySelector('.grid').masonry({
			itemSelector: '.grid-item',
			percentPosition: true,
			columnWidth: '.grid-item',
			gutter: 16,
			transitionDuration: '0.7s',
			horizontalOrder: true
		});
		document.querySelector('.grid-item').setAttribute("style", "visibility:visible;");
	});
	window.onscroll = function(e) {
		if(e.target.scrollY + e.target.innerHeight == document.body.clientHeight) {
			loadMoreGridImages();
		}
	};
});