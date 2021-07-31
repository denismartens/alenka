import { BUCKET_URL } from './../services/s3.js'

let Pricing = {
	render: async () => {
		let bannerImage = BUCKET_URL.concat('/images/banners/flowers.jpg');
		let view =  /*html*/`
			<div class='banner' style="background-image: url(${bannerImage})"></div>
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
	after_render: async () => {}
}

export default Pricing;