import fb from '../../assets/icons/facebook-24.png';
import ig from '../../assets/icons/instagram-24.png';
import ml from '../../assets/icons/mail-24.png';

const Footer = {
    render: async () => {
        const footerClass = window.location.hash.split('/')[1]
        const view =  /*html*/`
            <div class='flex-container ${footerClass}'>
                <div>
                    <a class='footer-link' href='https://www.facebook.com/alenamartensphotography'>
                        <img src=${fb}>
                    </a>
                    <a class='footer-link' href='https://www.instagram.com/alenamartens'>
                        <img src=${ig}>
                    </a>
                    <a class='footer-link' href='#'
                    data-contact='YWxlbmEucGFzdHVzaG9uYWtAZ21haWwuY29t'
                    data-subj='UGhvdG9ncmFwaHkgaW5xdWlyeQ=='
                    onfocus="this.href = 'mailto:' + atob(this.dataset.contact) + '?subject=' + atob(this.dataset.subj || '')">
                        <img src=${ml}>
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