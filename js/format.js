jQuery(document).ready(function(a) {
	var d = a('<div id="xiami-box"></div>').appendTo("body"),
	e = a('<div id="youku-box"></div>').appendTo("body"),
	g = "",
	h = "";
	d.html('<div id="xiami-wrapper">\t\t\t<div id="xiami-song" class="clearfix">\t\t\t\t<div id="xms-id">\t\t\t\t\t<a id="xms-empty" href="#"></a>\t\t\t\t\t<label id="xms-label" for="xms-input">\u5728\u6b64\u5904\u8f93\u5165\u867e\u7c73\u97f3\u4e50\u5730\u5740</label>\t\t\t\t\t<input id="xms-input" type="text" />\t\t\t\t</div>\t\t\t\t<div id="xms-preview" class="button-primary">\u9884\u89c8</div>\t\t\t\t<div id="xms-insert" class="button-primary">\u63d2\u5165\u6587\u7ae0</div>\t\t\t</div>\t\t\t<div id="xiami-footer">\t\t\t\t<div id="xiami-preview" class="clearfix">\t\t\t\t\t<div id="xmp-player"></div>\t\t\t\t\t\t\t\t\t</div>\t\t\t\t<div id="xiami-tip">[\u6ce8\u610f] \u8f93\u5165\u867e\u7c73\u97f3\u4e50\u5730\u5740\uff1a<strong>http://www.xiami.com/song/2091396</strong></div>\t\t\t</div>\t\t\t<div id="xiami-arrow">\t\t\t</div>\t\t</div>');
		
	a(document).click(function(a) {
		if ((e.is(":visible") || d.is(":visible")) && a.target) e.hide(),
		d.hide()
	});
	a("#xiami-box").click(function(a) { (e.is(":visible") || d.is(":visible")) && a.stopPropagation()
	});
	a("#mfthemes-xiami").click(function(b) {
		b.preventDefault();
		var b = a(this).offset().left,
		c = a(this).offset().top + a(this).height() +
		15;
		d.css({
			left: b,
			top: c
		}).show();
		e.hide();
		return ! 1
	});
	a("#xms-input").on("focus keyup input paste blur",
	function() {
		"" != a(this).val() ? (a("#xms-label").hide(), a("#xms-empty").show()) : (a("#xms-empty").hide(), a("#xms-label").show())
	});
	a("#xms-empty").on("click",
	function(b) {
		b.preventDefault();
		a("#xms-input").val("");
		a(this).hide();
		a("#xms-label").show();
		a("#xiami-preview").slideUp();
		a("#xms-preview").show();
		a("#xms-insert").hide();
		return ! 1
	});
	a("#xms-preview").on("click",
	function() {
		var b = a("#xms-input").val(),
		c = /http:\/\/www.xiami.com\/song\/(\d+).*?/; ! c.test(b) || !b ? alert("\u8bf7\u8f93\u5165\u6b63\u786e\u7684\u867e\u7c73\u6b4c\u66f2id\uff0c\u601d\u5bc6\u8fbe\uff01") : (b = b.match(c)[1], a("#xmp-rating a").removeClass("selected"), a("#xmp-player").empty().html('<embed src="http://www.xiami.com/widget/1_' + b + '/singlePlayer.swf" type="application/x-shockwave-flash" width="257" height="33" wmode="transparent"></embed>'), a("#xiami-preview").slideDown(), a(this).hide(), a("#xms-insert").show())
	});
	a("#xms-insert").on("click",
	function() {
		var b = c = a("#xms-input").val(),
					c = c.match(/http:\/\/www.xiami.com\/song\/(\d+).*?/)[1];					
					g = '[xiami]' + c + "[/xiami]";
		send_to_editor(g), a("#post-format-audio").click(), d.hide()
	});

});