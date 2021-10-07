import { BUCKET_URL, ResponsiveImage } from './../services/s3.js'

const About = {
	render: async () => {
		const bannerImage = new ResponsiveImage(BUCKET_URL.concat('/images/banners/lg/flowers.jpg'));
		const headshotImage = new ResponsiveImage(BUCKET_URL.concat('/images/about/lg/about.jpg'));
		const view =  /*html*/`
			<div class='banner'>
				<img class='hero' src='${bannerImage.src}' srcset='${bannerImage.srcset}' sizes='100vw'>
			</div>
			<div class='flex-container about'>
				<div class='row-container'>
					<div class='column-container'>
						<img src='${headshotImage.src}' srcset='${headshotImage.srcset}' sizes='40vw'>
					</div>
					<div class='column-container text-content text-left'>
						<p>
							I’m Alena. A number of years ago, I discovered photography and it became my greatest passion ever since.
							<br /><br />
							Like me, you know all important moments in our life come and go fast. The first date with your loved one, the first “I love you”, your baby’s first Christmas, first trip to the beach. You will never forget those moments, however, the details will fade with time.
							<br /><br />
							Photography allows you to capture the details and emotions and create a snapshot of that phase of your life that you can cherish forever.
							<br /><br />
							<q>Photography is the art of frozen time… the ability to store emotion and feelings within a frame.</q>
							<br /><br />
							Through my camera’s lens, I’m striving to capture your sweetest memories, emotions and feelings for many many years to come. My goal is to capture them in its utmost beauty and glory, so that you would be able to look at them with joy in the future and share them with the world.
						</p>
					</div>
				</div>
			</div>
		`
		return view
	},
	after_render: async () => {}
}

export default About;