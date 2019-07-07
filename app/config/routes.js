// Create route with name "Home" that will execute the "home" method of the "Static" controller
Router.add({
	name       : 'Home',
	methods    : 'get',
	paths      : '/',
	handler    : 'Static#home',
	breadcrumb : 'static.home'
});

Router.add({
	name       : 'Leaderboard',
	methods    : 'get',
	paths      : '/leaderboard',
	handler    : 'Static#leaderboard',
	breadcrumb : 'static.leaderboard'
});

Router.add({
	name       : 'Songs',
	methods    : 'get',
	paths      : '/songs',
	handler    : 'Static#songs',
	breadcrumb : 'static.songs'
});