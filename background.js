/* useless so far
console.log('Here is background scripts');
chrome.webNavigation.onHistoryStateUpdated.addListener(function(e){
	var historyStateURL = e.url;
    console.log(e.url);
    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {url: e.url}, function(response) {
		  console.log('sending msg to content scripts via chrome.tabs');
		});
	});           
});
*/