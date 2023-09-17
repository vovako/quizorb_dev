import interfacePage from './interfacePage.js'
import viewPage from './viewPage.js'

const ws = new WebSocket('ws://192.168.0.200:8080/websocket/newgame')
ws.onopen = function () {
	console.log('ws opened!');
	switch (location.pathname) {
		case '/':
		case '/index.html':
			interfacePage(ws)
			break
		case '/view.html':
			viewPage(ws)
			break
	}
}

ws.onclose = function (evt) {
	console.log('ws closed');
}


