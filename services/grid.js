import CarouselService from './../../services/carousel.js'

// init Masonry
const GridService = {
	initGrid: () => {
		let grid = new Masonry( '.grid', {
			itemSelector: '.grid-item',
			columnWidth: '.grid-item',
			gutter: '.gutter',
			transitionDuration: '0.7s',
			percentPosition: true,
			initLayout: false
		});
		GridService.loadGridItems(grid);
	},
	loadGridItems: (grid) => {
		let newGridItems = grid.items
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
		imagesLoaded(
			newGridItems.map(gridItem => gridItem.element),
			GridService.layoutGridItems.bind(null, grid, newGridItems));
	},
	layoutGridItems: (grid, gridItems) => {
		grid.layout();
		gridItems.forEach(function(gridItem) {
			gridItem.element.style.visibility = 'visible';
			gridItem.element.onclick = GridService.openCarousel.bind(null, gridItem);
		});
		GridService.loadGridItems(grid);
	},
	openCarousel: (gridItem) => {
		if (window.location.hash === '#/') {
			const currentImgSrc = gridItem.element.firstElementChild.getAttribute('src');
			// window.location.href = '/' + currentImgSrc.match(RegExp('([^/]+).jpg$'))[1];
		} else {
			const currentImgSrc = gridItem.element.firstElementChild.getAttribute('src').replace('/thumbnails', '/slides');
			const carouselItem = document.querySelector(".carousel-item > img[data-src=\"" + currentImgSrc + "\"], .carousel-item > img[src=\"" + currentImgSrc + "\"]");
			CarouselService.loadCarouselImage(
				carouselItem,
				CarouselService.initCarousel(carouselItem.parentElement, false));
			$('.modal').modal('show');
		}
	}
}

export default GridService;