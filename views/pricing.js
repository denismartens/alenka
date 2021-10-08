import S3Service from './../services/s3.js'

const Pricing = {
	render: async () => {
		const view =  /*html*/`
			<div class='banner'>
			</div>
			<div class='flex-container pricing'>
				<div class='row-container'>
					<div class='column-container text-content text-center'>
						<h4>Family photography package</h4>
						<br />
						<ul class='text-left'>
							<li>Up to 1.5 hour session</li>
							<li>20 high resolution, artistically edited images with printing rights - delivered via digital download</li>
							<li>Three complimentary 8 x 10 prints of your choice</li>
							<li>50% of the fee is required at the time of booking to secure your session date</li>
						</ul>
					</div>
					<div class='column-container text-content text-center'>
						<h4>Maternity photography package</h4>
						<br />
						<ul class='text-left'>
							<li>Up to 1 hour session (1-2 outfits)</li>
							<li>20 high resolution, artistically edited images with printing rights - delivered via digital download</li>
							<li>Three complimentary 8 x 10 prints of your choice</li>
							<li>50% of the fee is required at the time of booking to secure your session date</li>
						</ul>
					</div>
					<div class='column-container text-content text-center'>
						<h4>Event photography</h4>
						<br />
						<ul class='text-left'>
							<li>Corporate events</li>
							<li>Baptisms</li>
							<li>Grand openings</li>
							<li>Birthday parties</li>
						</ul>
					</div>
				</div>
			</div>
		`
		return view
	},
	after_render: async (id) => {
		const bannerImage = await S3Service.loadImage('images/banners/lg/flowers.jpg');
		bannerImage.sizes = '100vw';
		const banner = document.querySelector('.banner');
		banner.appendChild(bannerImage);
	}
}

export default Pricing;