import CarouselService from './../services/carousel.js'
import GridService     from './../services/grid.js'
import S3Service       from './../services/s3.js'

const Home = {
	render: async () => {
		const view =  /*html*/`
			<div class='brand col-md-8 offset-md-2 text-center'>Alena Martens Photography</div>
			<div id='carousel' class='carousel slide carousel-fade'>
				<div class='carousel-inner' role='listbox'>
				</div>
				<a class='carousel-control-prev' href='#carousel' role='button' data-slide='prev'>
					<span class='carousel-control-prev-icon' aria-hidden='true'></span>
					<span class='sr-only'>Previous</span>
				</a>
				<a class='carousel-control-next' href='#carousel' role='button' data-slide='next'>
					<span class='carousel-control-next-icon' aria-hidden='true'></span>
					<span class='sr-only'>Next</span>
				</a>
			</div>
			<div class='flex-container'>
				<br />
				<h4 class='text-content' style='font-size: 1.5rem'>
					Alena Martens is a photographer servicing Northern Virginia and Washington D.C.,<br />specializing in Family, Portrait & Travel Photography.
				</h4>
				<div class='grid'>
					<div class='gutter'></div>
				</div>
			</div>
		`
		return view
	},
	after_render: async (id) => {
		const firstImages = await S3Service.loadImages('images/landing/lg/', '', 1, '100vw');
		CarouselService.initCarousel(firstImages);

		const portfolios = ['portraits','maternity','travel','family'];
		Promise.allSettled(
			portfolios.map(p => S3Service.loadImages('images/'.concat(p, '/tl-lg/'), '', 1, '30vw')))
		.then(results => {
			const images = results.map(r => r.value).flat();
			GridService.initGrid(images, false);
		})
	}
}

export default Home;