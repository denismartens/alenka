const Navbar = {
    render: async () => {
        const view =  /*html*/`
            <nav class="navbar navbar-expand-sm navbar-dark">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#thenavbar" aria-controls="thenavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse justify-content-md-center" id="thenavbar">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="/#/">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="portfolio" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Portfolio</a>
                            <div class="dropdown-menu" aria-labelledby="portfolio">
                                <a class="dropdown-item" href="/#/portfolio/children">Children</a>
                                <a class="dropdown-item" href="/#/portfolio/family">Family</a>
                                <a class="dropdown-item" href="/#/portfolio/maternity">Maternity</a>
                                <a class="dropdown-item" href="/#/portfolio/portraits">Portraits</a>
                                <a class="dropdown-item" href="/#/portfolio/travel">Travel</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/#/about">About me</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/#/pricing">Services and Pricing</a>
                        </li>
                    </ul>
                </div>
            </nav>
        `
        return view
    },
    after_render: async () => {
        const currentPath = window.location.hash;
        if (currentPath.startsWith('#/portfolio')) {
            document.getElementsByTagName('nav')[0].style.backgroundColor = 'rgb(0,0,0,0.7)';
        }
        var menuItems = document.querySelectorAll('.nav-item a');
        menuItems.forEach(function(menuItem) {
            if (menuItem.getAttribute('href') === '/'.concat(currentPath)) {
                menuItem.className += ' active';
            }
        });
    }

}

export default Navbar;