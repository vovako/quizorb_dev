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

export function getState() {
	const URLparams = new URLSearchParams(location.search)
	const gameId = URLparams.get('id')

	const state = sessionStorage.getItem(gameId)
	return JSON.parse(state)
}
export function setState(state) {
	const URLparams = new URLSearchParams(location.search)
	const gameId = URLparams.get('id')

	sessionStorage.setItem(gameId, JSON.stringify(state))
}
export function hearbeat(socket) {
	setInterval(() => {
		socket.send(JSON.stringify({
			action: 'ping'
		}))
	}, 40000)
}