$(function(){
	console.log('Initialize searchCut!');
	//searchCut.setKeyCode_map('M','https://www.google.com/maps/place/','Google Map',0);
	//searchCut.setKeyCode_map('I','https://www.google.com/search?hl=zh-TW&site=imghp&tbm=isch&source=hp&q=','Google Image Search',0);
	//searchCut.setKeyCode_map('G','https://www.google.com/?#q=','Google Search',0);
	searchCut.loadLocalStorage();
	searchCut.init();
});

/*
@ The object of short cut mapping!
@ Prototype
	keyCode: {
		url_prefix: url,
		name: name
	}
*/
var keyCode_map = {};

/*
@ The class object of searchCut

*/
var searchCut = {
	init: function(){
		$('body').on('keydown',function(event){
			var keyCode = event.keyCode;
			if(keyCode in keyCode_map && event.altKey === true){
				var selectText = searchCut._getSelectionText();
				searchCut._openSearchPage(selectText,keyCode_map[keyCode].url_prefix);
			}
		});
	},
	loadLocalStorage: function(){
		/* Setting 
		chrome.storage.local.set({
			"prefix_key": "ALT",
			"current_searchCut": {
				"71":{"url_prefix":"https://www.google.com/?#q=","name":"Google Search"},
				"73":{"url_prefix":"https://www.google.com/search?hl=zh-TW&site=imghp&tbm=isch&source=hp&q=","name":"Google Image Search"},
				"77":{"url_prefix":"https://www.google.com/maps/place/","name":"Google Map"}
			},
			"origin_searchCut": {
				"71":{"url_prefix":"https://www.google.com/?#q=","name":"Google Search"},
				"73":{"url_prefix":"https://www.google.com/search?hl=zh-TW&site=imghp&tbm=isch&source=hp&q=","name":"Google Image Search"},
				"77":{"url_prefix":"https://www.google.com/maps/place/","name":"Google Map"}
			}	
		});
		*/
		
		console.log(keyCode_map);		
		chrome.storage.local.get(function(items){
			console.log(items.current_searchCut);
			for (key in items.current_searchCut){
				searchCut.setKeyCode_map(key,
					items.current_searchCut[key].url_prefix,
					items.current_searchCut[key].name,1);
			}
		})
	},
	/*
	flag = 0 => by Name
	flag = 1 => by Code
	*/
	setKeyCode_map: function(keyName_Code, urlPrefix, pageName, flag){
		if(flag === 0){
			keyCode_map[_keyCode[keyName_Code]] = {
				url_prefix: urlPrefix,
				name: pageName
			}	
		}
		if(flag === 1){
			keyCode_map[keyName_Code] = {
				url_prefix: urlPrefix,
				name: pageName
			}
		}
	},
	_getSelectionText: function(){
		var text = "";
	    if (window.getSelection) {
	        text = window.getSelection().toString();
	    } else if (document.selection && document.selection.type !== "Control") {
	        text = document.selection.createRange().text;
	    }
	    return text;
	},
	_openSearchPage: function(selectText, url){
		if(selectText !== ""){
			var win = window.open(url + selectText,'_blank');
			win.focus();
        }
        else{
        	alert('Please hightlight the text you want to search!');
        }
	}
}
 