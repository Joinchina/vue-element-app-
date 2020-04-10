import router from '@/router';

router.beforeEach((to, from, next) => {
	let title = to.meta.title;
	if(title) document.title = title;

	next();
});

router.afterEach((to, from, next) => {
    window.scrollTo(0, 0);
});