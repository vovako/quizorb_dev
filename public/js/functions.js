export function toPage(page) {
	const curPage = document.querySelector('[data-page].active')
	if (curPage) {
		curPage.classList.remove('active')
	}
	page.classList.add('active')
}
