var currentDevice = null;

function changeUrl(tab, url) {
    chrome.tabs.update(tab.id, {
	    'url': url
	});

}

function addUrlParameter(tab, param, value) {
	var query = `${param}=${value}`;
	var pattern = `(\\?|&)(${param}=[^[&|#]*)(#[^&]*)?`;
	var re = new RegExp(pattern);
	var connector = tab.url.match(/\?/) ? '&' : '?';
	var url = tab.url.match(re)? tab.url.replace(re, '$1' + query + '$3') : tab.url.replace(/([^#]*)(#[^&]*)?/, '$1' + connector + query + '$2'); //$1 = url, $2 = hash
    
        changeUrl(tab, url);
}

function removeUrlParameter(tab, param) {
	var pattern = `(\\?|&)(${param}=[^[&|#]*)(#[^&]*)?`;
	var re = new RegExp(pattern);
	var url = tab.url.replace(re, '');
    
        changeUrl(tab, url);
}

function dehash(tab) {
        var pattern = `(#[^&]*)`;
	var re = new RegExp(pattern);
	var url = tab.url.replace(re, '');
    
        changeUrl(tab, url);
}

document.addEventListener('DOMContentLoaded', function() {
	[].forEach.call(document.querySelectorAll('[name="device"]'), function(el) {
		el.addEventListener('click', function(e) {
			var device = e.target.value;
			currentDevice = e.target.value;
			chrome.tabs.getSelected(null, function(tab) {
				var param = isNaN(device) ? 'device' : 'mobile';
				addUrlParameter(tab, param, device);
			});
		}, false);
	});

	document.querySelector('.scache').addEventListener('click', function() {
		chrome.tabs.getSelected(null, function(tab) {
			addUrlParameter(tab, 'scache', Date.now().toString());
		});
	});
        
	document.querySelector('.dehash').addEventListener('click', function() {
		chrome.tabs.getSelected(null, function(tab) {
			dehash(tab);
		});
	});
	
	document.querySelector('#inspector').addEventListener('click', function(e) {
		chrome.tabs.getSelected(null, function(tab) {
			if (e.target.checked) {
				addUrlParameter(tab, 'inspector', 'on');
			} else {
				removeUrlParameter(tab, 'inspector');
			}
		});
	});
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		switch (request.command) {
			case 'scache':
				document.querySelector('.scache').click();
				break;
			case 'desktop':
				document.querySelector('#desktop').click();
				break;
			case 'smartphone':
				document.querySelector('#smartphone').click();
				break;
		}
	}
);
