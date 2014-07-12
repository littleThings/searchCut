$(function(){
	//UI.__reloadTestingData();
	UI.init();
	//UI.__clearStorage();
})


var UI = {
	exist_shortCut: [],
	init: function(){
		UI.loadSetting();
	},
	bind_editBtn: function(){
		$('#edit-btn').off('click.editBtn');
		$('#edit-btn').on('click.editBtn',function(){
			$('#edit-done-btn').show();
			$('#new-short-cut-row').slideDown();
			$('#detail-col-setting').slideDown();
			$(this).hide();
			$('.form-control').attr({'disabled':false});
			$('.switch-checkbox').hide();
			$('.searchCut-remove-icon').show();
		});
		$('#edit-done-btn').off('click.doneBtn');
		$('#edit-done-btn').on('click.doneBtn',function(){
			$('#edit-btn').show();
			$('#new-short-cut-row').slideUp();
			$('#detail-col-setting').slideUp();
			$(this).hide();
			$('.form-control').attr({'disabled':true});
			$('.switch-checkbox').show();
			$('.searchCut-remove-icon').hide();
			UI.scan_deletedShortCut();
			UI.saveSetting();
			UI.reset_settingState();
		});
	},
	reset_settingState: function(){
		// For Add new line
		$('#searchCut-new-name').val(''); // Empty name input
		$('#searchCut-new-url').val(''); // Empty url input
		$('#searchCut-new-shortcut').val(''); // Empty shortcut input
		// For remove btn => set all as 'un-remove'
		$('.searchCut-remove-icon').each(function(i,e){
			if($(e).hasClass('remove-state-icon')){
				$(e).removeClass('remove-state-icon').addClass('un-remove-state-icon');
			}
		});
	},
	bind_removeBtn: function(){
		$('.searchCut-remove-icon').off('click.removeBtn');
		$('.searchCut-remove-icon').on('click.removeBtn',function(){
			if($(this).hasClass('un-remove-state-icon')){
				$(this).removeClass('un-remove-state-icon').addClass('remove-state-icon');
			}
			else if($(this).hasClass('remove-state-icon')){
				$(this).removeClass('remove-state-icon').addClass('un-remove-state-icon');
			}
		});
	},
	bind_setShortCut: function(){
		$('.searchCut-short-cut').off('keydown.shortCut');
		$('.searchCut-short-cut').on('keydown.shortCut',function(event){
			var $currentDOM = $(this);
			var pre_keyChar = $currentDOM.val();
			if(event.keyCode in _keyCode_alph_num_inverse && UI.exist_shortCut.indexOf(event.keyCode) < 0){
				var  new_keyChar = _keyCode_alph_num_inverse[event.keyCode];
				setTimeout(function(){
					$currentDOM.val('');
					$currentDOM.val(new_keyChar);
				},20);
			}
			else if(UI.exist_shortCut.indexOf(event.keyCode) >= 0){
				alert('Shortcut exist! Please choose another key');
				setTimeout(function () {
					$currentDOM.val('');
					$currentDOM.val(pre_keyChar);
				 }, 20);
			}
			else{
				setTimeout(function () {
					$currentDOM.val('');
					$currentDOM.val(pre_keyChar);
				 }, 20);
			}
		});
	},
	bind_setPrefixKey: function(){
		$('#prefixKey-setting').off('change.prefixKey')
		$('#prefixKey-setting').on('change.prefixKey',function(){
			var currentPrefix = $(this).val();
			$('.short-cut-prefix').each(function(i,e){
				$(e).html(currentPrefix + ' +');
			});
		})
	},
	bind_switchCheckbox: function(){
		$('.switch-checkbox').off('change.changeBox');
		$('.switch-checkbox').on('change.changeBox',function(){
			var $currentCheckbox = $(this);
			console.log($currentCheckbox);
			console.log($currentCheckbox.prop('checked'));
			var $currentRow = $currentCheckbox.parent().parent().parent();
			if($currentCheckbox.prop('checked') === true){
				$currentRow.removeClass('unselected-trans');
				UI.saveSetting();
			}
			else{
				$currentRow.addClass('unselected-trans');	
				UI.saveSetting();
			}
		});
		$('.switch-checkbox').each(function(i,e){
			var $currentRow = $(e).parent().parent().parent();
			if($(e).prop('checked') === false){
				$currentRow.addClass('unselected-trans');
			}	
		});
	},
	bind_addBtn: function(){
		$('#searchCut-add-btn').off('click.addBtn');
		$('#searchCut-add-btn').on('click.addBtn',function(){
			var newName = $('#searchCut-new-name').val();
			var newUrl = $('#searchCut-new-url').val();
			var newShortCut_keyChar = $('#searchCut-new-shortcut').val();
			var prefixKey =  $('#prefixKey-setting').val();
			if(newName === '' || newUrl === '' || newShortCut_keyChar === '' ){
				if(newName === ''){
					alert('Please fill the "Name"');
					return
				}
				if(newUrl === ''){
					alert('Please fill the "URL prefix"');
					return
				}
				if(newShortCut_keyChar === ''){
					alert('Please set the "Short Cut"');
					return
				}
			}
			else{
				var tmp = _.template($('#short-cut-newline-template').html(), {
					name: newName,
					url_prefix: newUrl,
					keyChar: newShortCut_keyChar,
					prefix_key: prefixKey,
					enable: 'checked'
				});
				$('#new-short-cut-row').after(tmp);
				UI.bind_removeBtn();
				UI.bind_setShortCut();
				UI.bind_switchCheckbox();
				//Clear the val
				$('#searchCut-new-name').val('');
				$('#searchCut-new-url').val('');
				$('#searchCut-new-shortcut').val('');
			}
		});
	},
	bind_resetBtn: function(){
		$('#searchCut-reset-btn').on('click',function(){
			if(confirm('Are you sure want to reset the setting?\n All of your setting would lost.')){
				UI.__clearStorage();
				UI.init();
				location.reload();
			}
		});
	},
	bind_autoNameDetect: function(){
		$('#searchCut-new-name').on('focus',function(){
			if($('#name-setting').val() === 'Automatically Detect'){
				var url = $('#searchCut-new-url').val();			
			    if(url !== ''){
					$.get(url,function(data){
				    	var title = data.split('<title>')[1].split('</title>')[0];
				    	$('#searchCut-new-name').val(title);
				    });
			    }
			}
		});	
	},
	bind_autoUrlDetect: function(){
		$('#searchCut-new-url').on('focus',function(){
			if($('#url-setting').val() === 'Automatically Detect'){
				console.log('focus!');
				if($(this).val() === '')
					$('#myModal').modal();
			}
		});
		$('#autoUrl-confirm-btn').on('click',function(){
			if($('#url-setting').val() === 'Automatically Detect'){
				var originUrl = $('#autoUrl-result-url').val();
				var searchQuery = $('#autoUrl-user-query').val().replace(/\s+/g,"+");
				var decodeUrl = decodeURIComponent(originUrl);

				if(decodeUrl.indexOf(searchQuery) < 0)
					alert('Parsing error, please try manual mode');
				else{
					var urlPrefix = decodeUrl.split(searchQuery)[0];
				
					// Append the generated url
					$('#searchCut-new-url').val(urlPrefix);
					// Close modal
					$('#close-modal-btn').click();
				}
				console.log('origin_url: ' + originUrl);
				console.log('search_query: ' + searchQuery);
				console.log('decodeurl: ' + decodeURIComponent(originUrl));
				console.log('substring position: '+ decodeUrl.indexOf(searchQuery));
				console.log('urlPrefix: '+ urlPrefix);
			}
		});
	},
	scan_deletedShortCut: function(){
		var deletedCount = $('.remove-state-icon').length;
		if(deletedCount > 0){
			if (confirm('Are you sure you want to delete selected shortcut?')) {
			    $('.remove-state-icon').each(function(i,e){
			    	var $deletedRow = $(e).parent().parent();
			    	$deletedRow.remove();
			    });
			    alert('All change has been saved!');
			}
		}
	},
	generateTemplate: function(storageData){
		for (key in storageData.current_searchCut){
			var enable = ((storageData.current_searchCut[key].enable) ? 'checked' : '');
			var tmp = _.template($('#short-cut-list-template').html(), {
				name: storageData.current_searchCut[key].name,
				url_prefix: storageData.current_searchCut[key].url_prefix,
				keyChar: _keyCode_alph_num_inverse[key],
				prefix_key: storageData.prefix_key,
				enable: enable
			});
			$('#short-cut-list-tbody').append(tmp);
			UI.exist_shortCut.push(parseInt(key));
		}
		//init new line prefix_key
		$('#searhCut-new-prefix').html(storageData.prefix_key + ' + ');

		//init setting bar state
		$('#prefixKey-setting').val(storageData.prefix_key);
		$('#name-setting').val(storageData.name_setting);
		$('#url-setting').val(storageData.url_setting);	
	},
	loadSetting: function(){
		chrome.storage.local.get(function(items){
			if(! _.isEmpty(items)){
				console.log('load storage data');
				UI.generateTemplate(items);						
			}
			else{ // For never set only
				console.log('load init data')
				UI.generateTemplate(init_storageData);
			}
			UI.bind_editBtn();
			UI.bind_removeBtn();
			UI.bind_setShortCut();
			UI.bind_setPrefixKey();
			UI.bind_switchCheckbox();
			UI.bind_addBtn();
			UI.bind_resetBtn();
			UI.bind_autoNameDetect();
			UI.bind_autoUrlDetect();
		})
	},
	saveSetting: function(){
		//@ Store data prototype
		var storageData = {
			"prefix_key": NaN,
			"name_setting": NaN,
			"url_setting": NaN,
			"current_searchCut": {}
		};
		// Get the setting bar state
		var prefix_key = $('#prefixKey-setting').val();
		var name_setting = $('#name-setting').val();
		var url_setting = $('#url-setting').val();
		storageData.prefix_key = prefix_key;
		storageData.name_setting = name_setting;
		storageData.url_setting = url_setting;

		// Get the all the shortcut setting
		$('.searchCut-list-el').each(function(i,e){
			var $currentRow = $(e);
			var shortCut_key = _keyCode_alph_num[$currentRow.find('.searchCut-short-cut').val()];
			var url_prefix = $currentRow.find('.searchCut-url-prefix').val();
			var name = $currentRow.find('.searchCut-name').val();
			var enable = $currentRow.find('.searchCut-enable-checkbox').prop('checked');
			storageData.current_searchCut[shortCut_key] = {
				url_prefix: url_prefix,
				name: name,
				enable: enable
			};
		});
		// Store the data!
		chrome.storage.local.set(storageData);	
	},
	__reloadTestingData: function(){
		// Store the data!
		chrome.storage.local.set(UI.init_storageData);			
	},
	__clearStorage: function(){
		chrome.storage.local.clear();
	}
}