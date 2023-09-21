import interfacePage from './interfacePage.js'
import viewPage from './viewPage.js'

const ws = new WebSocket('wss://alii.serveo.net/websocket/connection')
ws.addEventListener('open',(event)=>{
	console.log("Соединение удалось")
})
switch (location.pathname) {
	case '/':
	case '/index.html':
		interfacePage()
		break
	case '/view.html':
		viewPage()
		break
}


