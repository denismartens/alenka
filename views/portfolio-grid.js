import GridService from './../services/grid.js'
import S3Service   from './../services/s3.js'
import Utils       from './../services/utils.js'

const PortfolioGrid = {
	render: async () => {
		const request = Utils.parseRequestURL();
		const thumbnails = await S3Service.listImages('images/'.concat(request.id, '/tl-lg/'));
		const images = await S3Service.listImages('images/'.concat(request.id, '/lg/'));
		const view = /*html*/`
			<div class='flex-container' style='margin-top: 62px'>
				<div class='grid'>
					<div class='gutter'></div>
						${thumbnails.map((tl) => `
							<div class='grid-item'>
								<img role='button' data-src='${tl.src}' data-srcset='${tl.srcset}' data-basename='${tl.basename}' sizes='30vw'>
							</div>
						`.trim()).join('')}
					</div>
				</div>
				<div class='modal fade' tabindex='-1' role='dialog'>
					<div class='modal-dialog'>
						<div class='modal-content'>
							<div id='carousel' class='carousel slide carousel-fade'>
								<div class='carousel-inner' role='listbox'>
									${images.map((img) => `
										<div class='item carousel-item'>
											<img class='my-img-fluid d-block' data-src='${img.src}' data-srcset='${img.srcset}' data-basename='${img.basename}' sizes='100vw'>
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