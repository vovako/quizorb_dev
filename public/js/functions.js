export function toPage(page) {
	const curPage = document.querySelector('[data-page].active')
	if (curPage) {
		curPage.classList.remove('active')
	}
	page.classList.add('active')
}

export const ws = new WebSocket('wss://izumra.ru/websocket/connection')
// wss://game-zmark.p.tnnl.in
// ws://localhost:8080
// ws://192.168.147.66
// wss://izumra.ru