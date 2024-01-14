export function toPage(page, state = null) {
	const curPage = document.querySelector('[data-page].active')
	if (curPage) {
		curPage.classList.remove('active')
	}
	page.classList.add('active')

	const pageName = page.dataset.page
	document.body.dataset.curPage = pageName

	if (state === null) return;
 	state.page = pageName
	setState(state)
}

export const ws = new WebSocket('ws://127.0.0.1:8080/websocket/connection')
// export const ws = new WebSocket('wss://izumra.ru/websocket/connection')
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
export function hearbeat() {
	setInterval(() => {
		ws.send(JSON.stringify({
			action: 'ping'
		}))
	}, 40000)
}

export function toLoginPage() {
	history.pushState(null, null, '')
	location = location.pathname
}

export function exitGame() {
	if (confirm('Выйти в меню игр?')) {
		ws.close()
		toLoginPage()
	}
}

export function exitAndDeleteGame(gameId) {
	if (confirm('Удалить игру?')) {
		// ws.close()
		
		ws.send(JSON.stringify({
			action: 'delete_game',
			data: gameId
		}))
		toLoginPage()
	}
}

export function waitForImageLoad(image) {
	return new Promise(resolve => image.onload = resolve)
}