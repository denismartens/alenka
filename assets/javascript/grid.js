// init Masonry
function initGrid() {
	const grid = new Masonry( '.grid', {
		itemSelector: '.grid-item',
		columnWidth: '.grid-item',
		gutter: '.gutter',
		transitionDuration: '0.7s',
		percentPosition: true,
		initLayout: false
	});
	loadGridItems(grid);
}

function loadGridItems(grid) {
	newGridItems = grid.items
		.filter(gridItem => !gridItem.element.firstElementChild.hasAttribute('src'))
		.slice(0, 12);
	if (newGridItems.length === 0) {
		return;
	}
	let img;
	newGridItems.forEach(function(gridItem) {
		img = gridItem.element.firstElementChild;
		img.setAttribute('src', img.getAttribute('data-src'));
	});
	imagesLoaded(newGridItems, layoutGridItems.bind(null, grid, newGridItems));
}

function layoutGridItems(grid, gridItems) {
	grid.layout();
	gridItems.forEach(function(gridItem) {
		gridItem.element.style.visibility = 'visible';
		gridItem.element.onclick = openCarousel;
	});
	loadGridItems(grid);
}

function openCarousel() {
	if (window.location.pathname === '/') {
		const current_img_src = this.firstElementChild.getAttribute('src');
		window.location.href = '/' + current_img_src.match(RegExp('([^/]+).jpg$'))[1];
	} else {
		const current_img_src = this.firstElementChild.getAttribute('src').replace('/thumbnails', '/slides');
		const carousel_item = document.querySelector(".carousel-item > img[data-src=\"" + current_img_src + "\"], .carousel-item > img[src=\"" + current_img_src + "\"]");
		loadCarouselImage(carousel_item, initCarousel(carousel_item.parentElement, false));
		$('.modal').modal('show');
	}
}

$(document).ready(function() {
	$('.modal').on('show.bs.modal', function() {
		window.location.hash = 'slides';
		window.onhashchange = function() {
			if (!location.hash) {
				$('.modal').modal('hide');
			}
		}
	});
	window.addEventListener('keyup', function (event) {
		if (event.defaultPrevented) {
			return; // Do nothing if the event was already processed
		}

		switch (event.key) {
			case 'Esc': // IE/Edge specific value
			case 'Escape':
				$('.modal').modal('hide');
				break;
			default:
				return; // Quit when this doesn't handle the key event.
		}

	  // Cancel the default action to avoid it being handled twice
	  event.preventDefault();
	}, true);

	$('.modal').on('hidden.bs.modal', function() {
		window.location.hash = '';
		hideCarousel();
	});
});