import Masonry         from '../assets/js/masonry.min.js'
import S3Service       from './../services/s3.js'

// init Masonry
const GridService = {
	initGrid: (firstImages, portfolio=true) => {
		GridService.appendImages(firstImages, portfolio);
		const grid = new Masonry( '.grid', {
			itemSelector: '.grid-item',
			columnWidth: '.grid-item',
			gutter: '.gutter',
			transitionDuration: '0.7s',
			percentPosition: true,
			initLayout: true
		});
		if (!portfolio) {
			return;
		}
		GridService.loadGridItems(grid);
	},
	loadGridItems: async (grid) => {
		while (true) {
			let lastImg = document.querySelector('.grid-item:last-child > img');
			if (!lastImg) {
				break;
			}
			let newImages = await S3Service.loadImages(
				lastImg.dataset.prefix,
				lastImg.dataset.prefix.concat(lastImg.dataset.basename),
				12,
				'30vw');
			if (newImages.length === 0) {
				break;
			}
			const gridItems = GridService.appendImages(newImages);
			grid.appended(gridItems);
		}
	},
	appendImages: (images, portfolio=true) => {
		const parent = document.querySelector('.grid');
		const gridItems = [];
		images.forEach(img => {
			const gridItem = document.createElement('div');
			gridItem.className = 'grid-item';
			img.setAttribute('role', 'button');
			gridItem.appendChild(img);
			if (portfolio) {
				img.onclick = GridService.openModal.bind(null, img);
			} else {
				img.onclick = GridService.goToPortfolio.bind(null, img);
				const label = document.createElement('p');
				label.textContent = img.dataset.portfolio;
				gridItem.appendChild(label);
			}
			gridItems.push(gridItem);
			parent.appendChild(gridItem);
		});
		return gridItems;
	},
	openModal: async (img) => {
		const modalImg = await S3Service.loadImage(
			img.src.replace('/tl-', '/'), '100vw');
		const modalContent = document.querySelector('.modal-content');
		modalContent.appendChild(modalImg)
		const modal = $('.modal');
		window.addEventListener('keyup', function (event) {
			if (event.defaultPrevented) {
				return; // Do nothing if the event was already processed
			}
			switch (event.key) {
				case 'Esc': // IE/Edge specific value
				case 'Escape':
					modal.modal('hide');
					break;
				default:
					return;
			}
		  // Cancel the default action to avoid it being handled twice
		  event.preventDefault();
		}, true);
		modal.modal('show');
		modal.on('hidden.bs.modal', () => {
			modalContent.removeChild(modalImg);
		});
	},
	goToPortfolio: (img) => {
		window.location.hash = '#/portfolio/'.concat(img.dataset.portfolio);
	}
}

export default GridService;