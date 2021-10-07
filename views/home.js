import CarouselService from './../services/carousel.js'
import GridService     from './../services/grid.js'
import S3Service       from './../services/s3.js'

const Home = {
	render: async () => {
		const thumbnails = await S3Service.listImages('images/landing/tl-lg/');
		const images = await S3Service.listImages('images/landing/lg/');
		const view =  /*html*/`
			<div class='brand col-md-8 offset-md-2 text-center'>Alena Martens Photography</div>
			<div id='carousel' class='carousel slide carousel-fade'>
				<div class='carousel-inner' role='listbox'>
					${images.map((img) => `
						<div class='item carousel-item'>
							<img class='hero' src='${img.src}' srcset='${img.srcset}' data-basename='${img.basename}' data-sizes='100vw'>
						</div>
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
					Alena Martens is a photographer servicing Northern Virginia and Washington D.C.,<br />specializing in Family, Portrait & Travel Photography.
				</h4>
				<div class='grid'>
					<div class='gutter'></div>
						${thumbnails.map((tl) => `
							<div class='grid-item'>
								<img role='button' data-src='${tl.src}' data-srcset='${tl.srcset}' data-basename='${tl.basename}' sizes='30vw'>
							</div>
						`.trim()).join('')}
					</div>
				</div>
			</div>
		`
		return view
	},
	after_render: async () => {
		const carouselItem = document.querySelector('.carousel-item');
		CarouselService.loadCarouselImage(carouselItem.firstElementChild, CarouselService.initCarousel.bind(null, carouselItem, 5000));
		GridService.initGrid();
	}
}

export default Home;