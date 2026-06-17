$(document).ajaxSuccess(function(event, xhr, settings, data) {
	var resources = xhr.getResponseHeader('Resources');
	if(resources)
	{
		resources = $.parseJSON(resources);
		
		var index = 0;
		
		var load = function()
		{
			if(typeof resources[index] !== 'undefined')
			{
				var file = resources[index].replace(/\?.*$/, '');
				
				index++;
				
				if(file.indexOf('.css') != -1)
				{
					var links = document.getElementsByTagName("link");
					for(var i = 0; i < links.length; i++)
					{
						if (links[i].href.substr(0, file.length) == file)
							return load();
					}

					var link = document.createElement("link");
					link.href = file;
					link.type = "text/css";
					link.rel = "stylesheet";
					link.media = "screen,print";
					link.onload = function() { $(document).trigger('style-loaded', [link]); load(); }

					document.getElementsByTagName("head")[0].appendChild(link);
				}
				else if(file.indexOf('.js') != -1)
				{
					var scripts = document.getElementsByTagName("script");
					for(var i = 0; i < scripts.length; i++)
					{
						if (scripts[i].src.substr(0, file.length) == file)
							return load();
					}

					var script = document.createElement("script");
					script.src = file;
					script.type = "text/javascript";
					script.onload = function() { $(document).trigger('script-loaded', [script]); load(); }

					document.getElementsByTagName("head")[0].appendChild(script);									
				}
			}
		};
		
		load();
	}
});
