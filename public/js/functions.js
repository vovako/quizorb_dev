export function toPage(page) {
	const curPage = document.querySelector('[data-page].active')
	const newPage = document.querySelector('[data-page="' + page + '"]')
	curPage.classList.remove('active')
	newPage.classList.add('active')
}
