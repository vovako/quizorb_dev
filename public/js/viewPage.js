import { toPage } from "./functions.js"

async function viewPage(ws) {
	ws.onmessage = function (event) {
		console.log(event.data)
		toPage('tiles')
	}
}

export default viewPage