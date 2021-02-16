import Utils       from './../../services/utils.js'
import S3Service   from './../../services/s3.js'
import GridService from './../../services/grid.js'

let PortfolioGrid = {

	render: async () => {
		let request = Utils.parseRequestURL();
		let gridImages = await S3Service.listObjects('assets/images/'.concat(request.id, '/thumbnails/'));
		let carouselImages = await S3Service.listObjects('assets/images/'.concat(request.id, '/slides/'));
		let view = /*html*/`
			<div class='flex-container' style='margin-top: 62px'>
				<div class='grid'>
					<div class='gutter'></div>
						${gridImages.map((image, i) => `
							<div class='grid-item'>
								<img role='button' data-src=${image}>
							</div>
						`.trim()).join('')}
					</div>
				</div>
				<div class='modal fade' tabindex='-1' role='dialog'>
					<div class='modal-dialog'>
						<div class='modal-content'>
							<div id='carousel' class='carousel slide carousel-fade'>
								<div class='carousel-inner' role='listbox'>
									${carouselImages.map((image, i) => `
										<div class='item carousel-item'>
											<img class='my-img-fluid d-block' data-src=${image}>
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
								<button type='button' class='close' data-dismiss='modal' aria-label='Close'>
									<span aria-hidden='true'>&times;</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		`
		return view
	},
	after_render: async () => {
		GridService.initGrid();
	}
}

export default PortfolioGrid;