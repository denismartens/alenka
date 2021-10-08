import S3Service from './../services/s3.js'

var carousel;
const CarouselService = {
	initCarousel: (firstImages) => {
		CarouselService.appendImages(firstImages);
		document.querySelector('.carousel-item').classList.add('active');
		carousel = $('#carousel').carousel({
			interval: 10000,
			wrap: true
		});
		CarouselService.loadNextImages();
		carousel.on('slid.bs.carousel', async (e) => {
			if (e.relatedTarget.isSameNode(
					document.querySelector('.carousel-item:last-child'))) {
				CarouselService.loadNextImages();
			}
		});
		window.addEventListener('keyup', function (event) {
			if (event.defaultPrevented) {
				return; // Do nothing if the event was already processed
			}
			switch (event.key) {
				case 'Left': // IE/Edge specific value
				case 'ArrowLeft':
					carousel.carousel('prev');
					break;
				case 'Right': // IE/Edge specific value
				case 'ArrowRight':
					carousel.carousel('next');
					break;
				default:
					return;
			}
		  // Cancel the default action to avoid it being handled twice
		  event.preventDefault();
		}, true);
	},
	loadNextImages: async () => {
		const lastImg = document.querySelector('.carousel-item:last-child > img');
		const newImages = await S3Service.loadImages(
			lastImg.dataset.prefix,
			lastImg.dataset.prefix.concat(lastImg.dataset.basename),
			1);
		if (newImages.length === 0) {
			console.log('no more images');
			return;
		}
		CarouselService.appendImages(newImages);
	},
	appendImages: (images) => {
		const parent = document.querySelector('.carousel-inner');
		images.forEach(img => {
			const carouselItem = document.createElement('div');
			carouselItem.className = 'carousel-item';
			carouselItem.appendChild(img);
			parent.appendChild(carouselItem);
		})
	}
}

export default CarouselService;
