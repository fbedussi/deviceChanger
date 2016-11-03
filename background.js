chrome.commands.onCommand.addListener(function(command) {
    chrome.runtime.sendMessage({
		"command": command
	});
});
