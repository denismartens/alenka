import { BUCKET_URL } from './../../services/s3.js'

let Contact = {
	render: async () => {
		let bannerImage = BUCKET_URL.concat('/assets/images/banners/flowers.jpg');
		let view =  /*html*/`
			<div class='banner' style="background-image: url(${bannerImage})"></div>
			<div class='flex-container contact'>
				<form class='text-content'>
					<div class='form-group'>
						<input type='text' class='form-control' name='name' placeholder='Your name'>
						<br />
						<input type='email' class='form-control' name='email' placeholder='Your email'>
						<br />
						<textarea class='form-control' name='message' placeholder='Your message' rows='5'></textarea>
					</div>
					<button type='submit' class='btn btn-primary'>Send&nbspMessage</button>
				</form>
			</div>
			<div class='modal fade' id='alertModal' tabindex='-1' role='dialog' aria-labelledby='alertModalLabel'>
			  <div class='modal-dialog' role='document'>
				<div class='modal-body'></div>
			  </div>
			</div>
		`
		return view
	},
	after_render: async () => {
		$('form').on('submit', function(e) {
			$.post({
				url: window.location.pathname,
				dataType: 'html',
				data: $(this).serialize(),
				success: function(data) {
					$('.modal-body').html(data);
					$('.modal').modal('show');
				}
			})
			e.preventDefault();
		})
	}
}

export default Contact;