import Masonry from '../assets/js/masonry.min.js'
import CarouselService from './carousel.js'

// init Masonry
const GridService = {
	initGrid: () => {
		const grid = new Masonry( '.grid', {
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
		const newGridItems = grid.items
			.filter(gridItem => !gridItem.element.firstElementChild.hasAttribute('src'))
			.slice(0, 12);
		if (newGridItems.length === 0) {
			return;
		}
		const newGridImages = Array.from(newGridItems).map(i => i.element.firstElementChild);
		newGridImages.forEach(function(img) {
			img.setAttribute('src', img.getAttribute('data-src'));
			img.setAttribute('srcset', img.getAttribute('data-srcset'));
		});
		Promise.all(newGridImages.map(img => img.decode())).then(GridService.layoutGridItems.bind(null, grid, newGridItems));
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
		if (window.location.hash === '#/' || window.location.hash == '') {
			const currentImgSrc = gridItem.element.firstElementChild.getAttribute('src');
			// window.location.href = '/' + currentImgSrc.match(RegExp('([^/]+).jpg$'))[1];
		} else {
			const imgBasename = gridItem.element.firstElementChild.getAttribute('data-basename');
			const carouselItem = document.querySelector(".carousel-item > img[data-basename=\"" + imgBasename + "\"]");
			CarouselService.loadCarouselImage(
				carouselItem,
				CarouselService.initCarousel(carouselItem.parentElement, false));
			$('.modal').modal('show');
		}
	}
}

export default GridService;