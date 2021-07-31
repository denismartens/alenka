require('./assets/js/bootstrap.bundle.min.js');
require('./assets/css/bootstrap.min.css');
require('./assets/css/app.css');

'use strict';

import Home          from './views/home.js'
import About         from './views/about.js'
import Pricing       from './views/pricing.js'
import PortfolioGrid from './views/portfolio-grid.js'

import Navbar        from './views/components/navbar.js'
import Footer        from './views/components/footer.js'

import Utils         from './services/utils.js'
import S3Service     from './services/s3.js'

// List of supported routes. Any url other than these routes will throw a 404 error
const routes = {
	'/'              : Home,
	'/about'         : About,
	'/pricing'       : Pricing,
	'/portfolio/:id' : PortfolioGrid,
};


// The router code. Takes a URL, checks against the list of supported routes and then renders the corresponding content page.
const router = async () => {

	// Lazy load view element:
	const header = null || document.getElementsByTagName('header')[0];
	const content = null || document.getElementsByTagName('main')[0];
	const footer = null || document.getElementsByTagName('footer')[0];

	// Render the Header and footer of the page
	header.innerHTML = await Navbar.render();
	await Navbar.after_render();
	footer.innerHTML = await Footer.render();
	await Footer.after_render();

	let request = Utils.parseRequestURL();

	let parsedURL = (request.resource ? '/' + request.resource : '/') + (request.id ? '/:id' : '') + (request.verb ? '/' + request.verb : '');

	let page = routes[parsedURL] ? routes[parsedURL] : Error404;
	content.innerHTML = await page.render();
	await page.after_render();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
window.addEventListener('load', S3Service.init());