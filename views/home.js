import S3Service from './../services/s3.js'
import CarouselService from './../services/carousel.js'
import GridService from './../services/grid.js'

let Home = {
	render: async () => {
		let carouselImages = await S3Service.listObjects('images/landing/slides/');
		let gridImages = await S3Service.listObjects('images/landing/thumbnails/');
		let view =  /*html*/`
			<div class='brand col-md-8 offset-md-2 text-center'>Alena Martens Photography</div>
			<div id='carousel' class='carousel slide carousel-fade'>
				<div class='carousel-inner' role='listbox'>
					${carouselImages.map(img => `
						<div class='item carousel-item' data-src=${img}></div>
					`.trim()).join('')}
				</div>
				<a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
					<span class="carousel-control-prev-icon" aria-hidden="true"></span>
					<span class="sr-only">Previous</span>
				</a>
				<a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
					<span class="carousel-control-next-icon" aria-hidden="true"></span>
					<span class="sr-only">Next</span>
				</a>
			</div>
			<div class='flex-container'>
				<br />
				<h4 class='text-content' style='font-size: 1.5rem'>
					Alena Martens is a Northern Virginia/Washington D.C. based photographer,<br />specializing in Family, Portrait & Travel Photography.
				</h4>
				<div class='grid'>
					<div class='gutter'></div>
						${gridImages.map(img => `
							<div class='grid-item'>
								<img role='button' data-src=${img}>
								<p>${img.substring(img.lastIndexOf('/') + 1, img.length - 4)}</p>
							</div>
						`.trim()).join('')}
					</div>
				</div>
			</div>
		`
		return view
	},
	after_render: async () => {
		let carouselItem = document.querySelector('.carousel-item');
		CarouselService.loadHeroImage(carouselItem, CarouselService.initCarousel.bind(null, carouselItem, 5000));
		GridService.initGrid();
	}
}

export default Home;