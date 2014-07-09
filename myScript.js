$(function(){
	console.log('Initialize searchCut!');
	searchCut.init();
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
	console.log('New setting!');
	searchCut.de_init();
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
	prefix_key: NaN, // prototype: ['ALT', 'CTRL' ...]
	init: function(){
		//Load the storage data first	
		chrome.storage.local.get(function(items){
			if(! _.isEmpty(items)){
				console.log('load short cut from chrome.storage');
				searchCut.bind_shortcut(items);
			}
			else{
				console.log('load short cut from init storage data');
				searchCut.bind_shortcut(init_storageData);
			}
		})
	},
	de_init: function(){
		$('body').off('keydown.searchCut_shortcut');
		searchCut.prefix_key= NaN;
	},
	bind_shortcut: function(items){
		for (key in items.current_searchCut){
				searchCut.setKeyCode_map(key,
					items.current_searchCut[key].url_prefix,
					items.current_searchCut[key].name,1);
			}
			searchCut.prefix_key = items.prefix_key.replace(/\s+/g,'').split('+');
			$('body').on('keydown.searchCut_shortcut',function(event){
				var keyCode = event.keyCode;
				if(keyCode in keyCode_map 
					&& event.altKey === searchCut.hasPrefix_key('ALT') 
					&& event.ctrlKey === searchCut.hasPrefix_key('CTRL')){
					var selectText = searchCut._getSelectionText();
					searchCut._openSearchPage(selectText,keyCode_map[keyCode].url_prefix);
				}
		});
	},
	hasPrefix_key: function(keyChar){
		if(searchCut.prefix_key.indexOf(keyChar) >= 0){			
			return true
		}
		else{		
			return false
		}
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
 