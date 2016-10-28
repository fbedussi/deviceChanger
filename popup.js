function addUrlParameter(tab, param, value) {
	var query = `${param}=${value}`;
	var pattern = `(\\?|&)(${param}=[^[&|#]*)(#[^&]*)?`;
	var re = new RegExp(pattern);
	var connector = tab.url.match(/\?/) ? '&' : '?';
	var url = tab.url.match(re)? tab.url.replace(re, '$1' + query + '$3') : tab.url.replace(/([^#]*)(#[^&]*)?/, '$1' + connector + query + '$2'); //$1 = url, $2 = hash
    
	chrome.tabs.update(tab.id, {
		'url': url
	});
}

document.addEventListener('DOMContentLoaded', function() {
	[].forEach.call(document.querySelectorAll('[name="device"]'), function(el) {
		el.addEventListener('click', function(e) {
			var device = e.target.value;

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
});