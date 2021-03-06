
// MinimalScrollbar
// MIT Licensed, iaarchiver (c) 2013
// : app.js

(function(window){

	// VARS FOR INIT ////////////////////////////////////////////////////////////

	var defaultOptions = {
		autohide: true,
		excluded: "https://chrome.google.com, "
				+ "https://mail.google.com, "
				+ "https://groups.google.com,"
				+ "mail.live.com"
	}


	// FUNC FOR INIT ////////////////////////////////////////////////////////////

	function isExcluded(_opt){
		if (!_opt.excluded) return false;

		var domains = _opt.excluded.split(/[,\n] ?/);
		for (var i = domains.length; i--;) {

			// detect complete URL match
			if (document.URL.indexOf(domains[i]) === 0) return true;
			
			// detect domain match
			if (document.location.host.indexOf(domains[i]) > -1) return true;
		}
		return false;
	}

	function isIframed(_opt){
		var _isIframed = (window != parent);
		return _isIframed;
	}


	function hideWebkitScrollbar(){
		var styleElement = document.createElement('style');
		styleElement.innerHTML =
			'html::-webkit-scrollbar{display:none !important}'+
			'body::-webkit-scrollbar{display:none !important}';

		document.getElementsByTagName('body')[0].appendChild(styleElement);
	}

	function redrawWebkitScrollbar(){
		var html_element = document.getElementsByTagName('html')[0],
			body_element = document.body;

		var html_overflow_cache = html_element.style.overflow,
			body_overflow_cache = body_element.style.overflow;

		html_element.style.overflow = 'hidden';
		body_element.style.overflow = 'hidden';
		setTimeout(function(){
			html_element.style.overflow = html_overflow_cache;
			body_element.style.overflow = body_overflow_cache;
		},100);
	}

	function isHiddenWebkitScrollbar(){
		var noVerticalWS = (document.body.clientWidth == window.innerWidth),
			noHorizontalWS = (document.body.clientHeight == window.innerHeight);

		return (noVerticalWS && noHorizontalWS);
	}

	function domReady(callb){
		if (document.readyState != 'loading') callb();
		window.addEventListener('DOMContentLoaded', callb, false);
	}

	// INITIALIZE ///////////////////////////////////////////////////////////////

	(function init(){

		// get synced option data
		chrome.storage.sync.get(function(items){
			if(chrome.extension.lastError !== undefined)
				console.log('Error: restoreSettings');

			// restore option settings if exists
			var options = (Object.keys(items).length)? items: defaultOptions;

			// cancel if is excluded url
			if (isExcluded(options)) return false;

			// add data-attribute to html
			document.documentElement.setAttribute('data-minimalscrollbar','yes')

			// add CSS to disable webkit-scrollbar appearance
			if (!isIframed(options)) hideWebkitScrollbar();

			// Generate MinimalScrollbars if is not iframed
			if (!isIframed(options))
				new window.MinimalScrollbar(options);

			// redraw body
			domReady(function(){
				if (!isHiddenWebkitScrollbar()) redrawWebkitScrollbar();
			})
		});

	}) ();

}) (window);
