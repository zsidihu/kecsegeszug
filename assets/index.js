(function(){
	var id = function(x){return document.getElementById(x)}, pressed = 1, span = document.createElement('span');

	window.block = {
		long2ip : function(ip){
			if (!isFinite(ip))
				return false;

				return [ip >>> 24, ip >>> 16 & 0xFF, ip >>> 8 & 0xFF, ip & 0xFF].join('.');
		},
		ipv4 : function(n){
			var force = parseInt(n.getAttribute('data-force') || 0),
			ipv4 = parseInt(n.getAttribute('data-ipv4') || 0);

			if(!force){
				n.innerHTML = '<span style="color:#900;">' + this.long2ip(ipv4) + '</span> - IP cím engedélyezése' +
				'<input name="ipv4" type="hidden" value="' + ipv4 + '"/>' +
				'<input name="save" type="hidden" value="0"/>';

				n.setAttribute('data-force', 1);
			}
			else{
				n.innerHTML = '<span style="color:#090;">' + this.long2ip(ipv4) + '</span> - IP cím blokkolása' +
				'<input name="ipv4" type="hidden" value="' + ipv4 + '"/>' +
				'<input name="save" type="hidden" value="1"/>';

				n.setAttribute('data-force', 0);
			}
		}
	};

	window.overlay = {
		onshow : function(){
			id('window').style.display =
			id('wndbox').style.display = 'block';
			id('wndbox').appendChild(span);
		},
		onopen : function(){
			id('wndbox').removeChild(span);
			id('iframe').style.display = 'inline';
		},
		onclose : function(){
			id('window').style.display =
			id('iframe').style.display = 'none';
		}
	};

	window.cookie = {
		getcookie : function(cookie){
			var n = cookie + "=";
			var d = document.cookie.split(';');

			for(var i = 0; i < d.length; i++){
				var c = d[i];

				while(c.charAt(0) == ' ') c = c.substring(1);
				if(c.indexOf(n) == 0) return c.substring(n.length, c.length);
			}

			return "";
		},
		setcookie : function(cookie, value, days){
			var d = new Date();

			d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "expires = " + d.toUTCString();

			document.cookie = cookie + "=" + value + "; " + expires;
		},
		accept : function(){
			var cookie = this.getcookie('kecseges').split('|'), accepted = 'ACCEPTED';

			for(var i = 1; i < cookie.length; i++){
				accepted += '|' + cookie[i];
			}

			this.setcookie('kecseges', accepted, 365);
			id('cookie').style.display = 'none';

			return false;
		}
	};

	window.textformat = {
		style : function(txtbox, format){
			var box = id(txtbox),
			txt = box.value,
			str = box.selectionStart,
			end = box.selectionEnd;

			if(pressed){
				box.value = (str == end) ?
				txt.substring(0, str) + '[' + format + '][/' + format + ']' + txt.substring(end) :
				txt.substring(0, str) + '[' + format + ']' + txt.substring(str, end) + '[/' + format + ']' + txt.substring(end);
			}
		},
		tohtml : function(text){
				return text.replace(/\n/g, '<br />')
				.replace(/\[b\](.*?)\[\/b\]/g, '<strong>$1</strong>')
				.replace(/\[i\](.*?)\[\/i\]/g, '<i>$1</i>')
				.replace(/\[u\](.*?)\[\/u\]/g, '<u>$1</u>')
				.replace(/\[h\](.*?)\[\/h\]/g, '<span class="h2">$1</span>')
				.replace(/\[url\](.*?)\[\/url\]/g, '<a href="$1" target="_blank">$1</a>')
				.replace(/\[img\](.*?)\[\/img\]/g, '<img src="$1" alt="" />');
		},
		content : function(button){
			var html = id('html'), state = parseInt(button.getAttribute('data-pressed') || 0);

			if(state){
				pressed = 0;
				button.setAttribute('data-pressed', 0);
				button.setAttribute('class', 'format off');

				html.innerHTML = this.tohtml(id('code').value);
				html.style.display = 'block';
			}
			else{
				pressed = 1;
				button.setAttribute('data-pressed', 1);
				button.setAttribute('class', 'format on');
				html.style.display = 'none';
			}			
		},
		autogrow : function(box){
			box.style.height = ""; /* Reset the height*/
			box.style.height = Math.min(box.scrollHeight, 300) + "px";
		}
	}

	span.setAttribute('id', 'loader');
}());

