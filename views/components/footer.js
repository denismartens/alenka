let Footer = {
    render: async () => {
        let footerClass = window.location.hash.split('/')[1]
        let view =  /*html*/`
            <div class='flex-container ${footerClass}'>
                <div>
                    <a class='footer-link' href='https://www.facebook.com/alenamartensphotography'>
                        <img src='assets/icons/facebook-24.png'>
                    </a>
                    <a class='footer-link' href='https://www.instagram.com/alenamartens'>
                        <img src='assets/icons/instagram-24.png'>
                    </a>
                    <a class='footer-link' href="#"
                    data-contact="YWxlbmEucGFzdHVzaG9uYWtAZ21haWwuY29t"
                    data-subj="UGhvdG9ncmFwaHkgaW5xdWlyeQ=="
                    onfocus="this.href = 'mailto:' + atob(this.dataset.contact) + '?subject=' + atob(this.dataset.subj || '')"
                    >
                        <img src='assets/icons/mail-24.png'>
                    </a>
                </div>
                &nbsp
                <div>© Alena Martens Photography 2021</div>
            </div>
        `
        return view
    },
    after_render: async () => {}
}

export default Footer;