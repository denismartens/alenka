jQuery.fn.carousel.Constructor.TRANSITION_DURATION = 1500;
var carousel;
function initCarousel(currentItem, interval) {
	currentItem.classList.add('active');
	carousel = $('#carousel').carousel({
		interval: interval
	});
	carousel.on('slide.bs.carousel', function(e) {
		if (window.location.pathname === '/') {
			loadHeroImage(e.currentTarget);
		} else {
			loadCarouselImage(e.currentTarget.firstElementChild);
		}
	});
	carousel.on('slid.bs.carousel', function (e) {
		if (window.location.pathname === '/') {
			loadHeroImage(e.relatedTarget);
		} else {
			loadCarouselImage(e.relatedTarget.firstElementChild);
		}
	});
	$(document).bind('keyup', function(e) {
		if(e.which == 39){
			carousel.carousel('next');
		} else if(e.which == 37){
			carousel.carousel('prev');
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
				return; // Quit when this doesn't handle the key event.
		}

	  // Cancel the default action to avoid it being handled twice
	  event.preventDefault();
	}, true);
}

function hideCarousel() {
	carousel.carousel('dispose');
	document.querySelector('.carousel-item.active').classList.remove('active');
}

function loadHeroImage(currentImage, do_after) {
	if (currentImage.style.backgroundImage === '') {
		currentImage.style.backgroundImage = 'url(' + currentImage.getAttribute('data-src') + ')';
	}
	imagesLoaded(currentImage, do_after);
}

function loadCarouselImage(currentImage, do_after) {
	if (!currentImage.hasAttribute('src')) {
		currentImage.setAttribute('src', currentImage.getAttribute('data-src'));
	}
	imagesLoaded(currentImage, do_after);
}