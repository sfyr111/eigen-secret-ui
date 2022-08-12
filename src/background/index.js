// window.perfWatch = {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	console.log('background:', message)
	// window.perfWatch[sender.tab.id] = message.essential || null
})