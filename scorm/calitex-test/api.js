(function(w, $) {

	function api() {
		var $this = this;
		
		$this.get = function(url, success, fail) {
			return $this.request('get', url, null, success, fail);
		}
		
		$this.post = function(url, data, success, fail) {
            if(typeof data == 'function')
            {
                fail = success;
                success = data;
                data = {};
            }
            
			return $this.request('post', url, data, success, fail);
		}
		
		$this.request = function(method, url, data, success, fail) {
            var request;
            
			if(method === 'post')
			{
				if (window.security.token !== undefined)
				{
					if(data)
					{
						if(typeof data === 'object')
						{
							if($.isArray(data))
							{
								data.push(window.security.token);
							}
							else
							{
								data[window.security.token.name] = window.security.token.value;
							}
						}
						else if(typeof data === 'string')
						{
							data += (data.length ? '&' : '') + window.security.token.name + '=' + window.security.token.value;
						}
					}
					else
					{
						data = [window.security.token];
					}
				}
				
				request = $.post(url, data, function(response) {
					$this.response(response, success, fail);
				});
			}
			else if(method === 'get')
			{
				request = $.get(url, function(response) {
					$this.response(response, success, fail);
				});
			}
            
            return request;
		};
		
		$this.response = function(response, success, fail) {
            var called = false;
			try {
				result = $.parseJSON(response);
				
				if(typeof result.result !== 'undefined')
				{
					if(result.result)
					{
						if(success && typeof success == 'function')
						{
                            called = true;
							return success(result.data);
						}
					}
					else
					{
						if(fail && typeof fail == 'function')
						{
                            called = true;
							return fail(result.data);
						}
					}
				}
				else
				{
                    called = true;
                    if(typeof success == 'function')
                    {
                        return success(result);
                    }
				}
				
			} catch(error) {
                if(!called)
                {
                    if(typeof success == 'function')
                    {
                        return success(response);
                    }
                }
			}
        }
		
		return $this;
	}
	
	w.api = new api();
})(window, jQuery);