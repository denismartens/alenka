import GridService from './../services/grid.js'
import S3Service   from './../services/s3.js'

const PortfolioGrid = {
	render: async () => {
		const view = /*html*/`
			<div class='flex-container' style='margin-top: 62px'>
				<div class='grid'>
					<div class='gutter'></div>
				</div>
				<div class='modal fade' tabindex='-1' role='dialog'>
					<div class='modal-dialog'>
						<div class='modal-content'>
							<button type='button' class='close' data-dismiss='modal'>
								<span>&times;</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		`
		return view
	},
	after_render: async (id) => {
		const firstImages = await S3Service.loadImages('images/'.concat(id, '/tl-lg/'), '', 12, '30vw');
		GridService.initGrid(firstImages);
	}
}

export default PortfolioGrid;