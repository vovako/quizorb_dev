import { toPage } from "./functions.js"

async function viewPage(ws) {
	ws.onmessage = function () {
		toPage('tiles')
	}
}

export default viewPage