let Footer = {
    render: async () => {
        let view =  /*html*/`
            <div class='flex-container'>
                <div>
                    <a href='https://www.facebook.com/alenamartensphotography'>
                        <img src='assets/icons/icons8-facebook-48.png'>
                    </a>
                    <a href='mailto:alena.pastushonak@gmail.com'>
                        <img src='assets/icons/icons8-gmail-48.png'>
                    </a>
                    <a href='https://www.instagram.com/alenamartens'>
                        <img src='assets/icons/icons8-instagram-48.png'>
                    </a>
                </div>
                <div>© Alena Martens Photography 2021</div>
            </div>
        `
        return view
    },
    after_render: async () => {}
}

export default Footer;