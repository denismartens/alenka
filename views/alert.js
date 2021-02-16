let Alert = {
	render: async () => {
		let alertType = 'success';
		let alertText = 'Thank you, your message has been sent!';
		let view =  /*html*/`
			<div class="alert alert-${alertType} text-center" role='alert'>
				${alertText}
				<button type='button' class='close' data-dismiss='modal' aria-label='Close'>
					<span aria-hidden='true'>
						&times;
					</span>
				</button>
			</div>
		`
		return view
	},
	after_render: async () => {}
}

export default Alert;