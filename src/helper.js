(function(){
	var i,
		h1 = document.querySelector('h1'),
		h2 = document.querySelector('h2'),
		list = document.querySelectorAll('.keys a[href*="blockchain.info"]'),
		url = 'http://blockchain.info/multiaddr?limit=0&cors=true&active=';

	if(!h1 || !h2 || !list) {
		return;
	}
	// format current page/total pages
	h2.innerHTML = h2.innerHTML.replace('Page ','').replace('out of ','\n');

	// generate random page number
	var maxPage = h2.innerHTML.split('\n')[1];
	var digits = Math.ceil(Math.random()*maxPage.length);
	do {
		var valid = true, page = '';
		for(i=0;i<digits;i++) {
			page += Math[i?'floor':'ceil'](Math.random()*(i?10:9));
		}
		if(digits==maxPage.length) {
			for(i=0;i<digits;i++) {
				var rc = page[i]|0, mc = maxPage[i]|0;
				if(rc!=mc) {
					valid = rc<mc;
					break;
				}
			}
		}
	} while(!valid);
	h1.innerHTML += ' <a href="/'+page+'">[Random Page]</a>';

	// check wallets
	if(!list.length) {
		return;
	}
	for(i=list.length;i--;) {
		url += list.item(i).text + '%7C';
	}
	var xhr = new XMLHttpRequest();
	xhr.open('GET',url,true);
	xhr.onreadystatechange = function(){
		if(xhr.readyState != 4) {
			return;
		}
		var res = false;
		try {
			res = JSON.parse(xhr.responseText);
		} catch(e) {
			// do nothing
		}
		if(res===false || !res.addresses) {
			return;
		}
		var ao = res.addresses, al = {};
		for(i=ao.length;i--;) {
			al[ao[i].address] = [ ao[i].final_balance|0, ao[i].n_tx|0 ];
		}
		var pre = document.querySelector('.keys');
		var lines = pre.innerHTML.split('\n'), c = list.length;
		for(i=lines.length;i--;) {
			var line = lines[i];
			if(!line.length || line.indexOf('<strong>')===0) {
				continue;
			}
			var adr = list.item(--c).text, d = al[adr], tf = d[0], tx = d[1], tag = tf>0 ? 'b' : 'i';
			lines[i] += '\t\t<'+tag+'>'+(tf>0 ? (tf/100000000).toFixed(8).replace(/\.?0+$/g,'') : 0)+'\t\t['+tx+']</'+tag+'>';
		}
		pre.innerHTML = lines.join('\n');
		console.debug('IamFeelingLucky update complete');
	};
	xhr.send();
})();