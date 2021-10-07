// jquery.fn.carousel.Constructor.TRANSITION_DURATION = 1500;

var btCarousel;
const CarouselService = {
	initCarousel: (currentItem, interval) => {
		currentItem.classList.add('active');
		btCarousel = $('#carousel').carousel({
			interval: interval,
			wrap: true
		});
		const closeButton = document.querySelector('#carousel > button');
		if (closeButton) {
			closeButton.onclick = CarouselService.hideCarousel.bind(null);
		}
		btCarousel.on('slide.bs.carousel', function(e) {
			if (e.currentTarget.id === 'carousel') {
				return;
			}
			CarouselService.loadCarouselImage(e.currentTarget.firstElementChild);
		});
		btCarousel.on('slid.bs.carousel', function (e) {
			CarouselService.loadCarouselImage(e.relatedTarget.firstElementChild);
		});
		$(document).bind('keyup', function(e) {
			if(e.which == 39){
				btCarousel.carousel('next');
			} else if(e.which == 37){
				btCarousel.carousel('prev');
			}
		});

		window.addEventListener('keyup', function (event) {
			if (event.defaultPrevented) {
				return; // Do nothing if the event was already processed
			}

			switch (event.key) {
				case 'Left': // IE/Edge specific value
				case 'ArrowLeft':
					btCarousel.carousel('prev');
					break;
				case 'Right': // IE/Edge specific value
				case 'ArrowRight':
					btCarousel.carousel('next');
					break;
				case 'Esc': // IE/Edge specific value
				case 'Escape':
					if (window.location.hash.startsWith('#/portfolio')) {
						$('.modal').modal('hide');
						CarouselService.hideCarousel();
					}
					break;
				default:
					return; // Quit when this doesn't handle the key event.
			}

		  // Cancel the default action to avoid it being handled twice
		  event.preventDefault();
		}, true);
	},
	hideCarousel: () => {
		btCarousel.carousel('dispose');
		const element = document.querySelector('.carousel-item.active');
		if (element) {
			element.classList.remove('active');
		}
	},
	loadCarouselImage: (currentImage, do_after) => {
		if (!currentImage.hasAttribute('src')) {
			currentImage.setAttribute('src', currentImage.getAttribute('data-src'));
			currentImage.setAttribute('srcset', currentImage.getAttribute('data-srcset'));
		}
		currentImage.onload = do_after;
	}
}

export default CarouselService;
