var pureBody = jQuery("body"),
defaultScroll = 0,
box = ["toolbar=0,status=0,resizable=1,width=640,height=560,left=", (screen.width - 640) / 2, ",top=", (screen.height - 560) / 2].join(""),
$cancel = jQuery('#cancel-comment-reply-link'),
cancel_text = $cancel.text(),
H = false,
$header = jQuery("#header-nav"),
backToTop = jQuery("#backtoTop"),
backtoTopCanvas = jQuery("#backtoTopCanvas");
var LEE = {
	submitComment: function($this) {
		var $commentform = jQuery('#commentform'),
		$commentCount = jQuery('.commentCount'),
		commentCount = parseInt($commentCount.html());
		if ($this.hasClass("is-active")) {
			createButterbar('别提交太快:-)');
			return false;
		} else {
			this.editcode();
			$this.addClass("is-active");
			pureBody.addClass('is-loadingApp');
			jQuery.ajax({
				url: PURE.ajax_url + "comment/new",
				data: $commentform.serialize() + "&action=ajax_comment&_wpnonce=" + PURE.nonce,
				type: "POST",
				dataType: "json",
				success: function(data) {
					pureBody.removeClass('is-loadingApp');
					if (data.status == 500) {
						createButterbar(data.data.code);
						setTimeout(function() {
							$this.removeClass("is-active");;
						},
						3000);
					} else {
						var new_comment = '<li class="comment v-overflowHidden new--comment"><div class="comment-block"><div class="comment-info"><div class="comment-avatar">' + data.data.avatar + '</div><div class="comment-meta fontSmooth"><div class="name">' + data.data.comment_author + '</div><div class="time">' + data.data.comment_time + '</div></div></div><div class="comment-content"><p>' + data.data.comment_text + '</p></div></div></li>';
						jQuery('textarea').each(function() {
							this.value = ''
						});
						var t = LEE,
						cancel = t.I('cancel-comment-reply-link'),
						temp = t.I('wp-temp-form-div'),
						respond = t.I(t.respondId),
						post = t.I('comment_post_ID').value,
						parent = t.I('comment_parent').value;
						if (parent != '0') {
							jQuery('#respond').before('<ul class="children">' + new_comment + '</ul>');
						} else {
							jQuery('.commentlist').append(new_comment);
						}
						createButterbar('<i class="iconfont icon-sun"></i>提交成功');
						commentCount = commentCount + 1;
						$commentCount.html(commentCount);
						setTimeout(function() {
							$this.removeClass("is-active");;
						},
						9000);
						cancel.style.display = 'none';
						cancel.onclick = null;
						t.I('comment_parent').value = '0';
						if (temp && respond) {
							temp.parentNode.insertBefore(respond, temp);
							temp.parentNode.removeChild(temp)
						}
					}
				}
			});
			return false;
		}
	},
	postlike: function($this) {
		if ($this.hasClass('is-active')) {
			createButterbar('您已经赞过啦:-)');
		} else {
			$this.addClass('is-active');
			var id = $this.data("id"),
			resultWrapper = $this.children('.count'),
			ajax_data = {
				action: "fa_action",
				actionname: "postlike",
				postid: id
			};
			pureBody.addClass('is-loadingApp');
			$this.addClass('is-activing');
			$.ajax({
				type: "PUT",
				url: PURE.ajax_url + 'vote',
				data: ajax_data,
				dataType: 'json',
				success: function(data) {
					pureBody.removeClass('is-loadingApp');
					if (data.status == 200) {
						resultWrapper.html(data.data);
					} else {
						createButterbar(data.data);
					}
				}
			});
		}
		return false;
	},
	openRate: function(DOM) {
		if (DOM.parent().hasClass('combo-open'))
		 {
			DOM.parent().removeClass('combo-open')
			 DOM.next().hide();
		}
		 else
		 {
			DOM.parent().addClass('combo-open')
			 DOM.next().show();
		}
	},
	rate: function(DOM) {
		var score = DOM.data("rating"),
		id = DOM.parent().parent().parent().data("post-id"),
		rateHolder = DOM.parent().parent().parent().parent(),
		history = rateHolder.html(),
		ajax_data = {
			action: "post_rate",
			um_id: id,
			um_score: score
		};
		rateHolder.html('loading..');
		jQuery.ajax({
			url: PURE.ajax_url + 'rate',
			type: "PUT",
			data: ajax_data,
			dataType: "json",
			success: function(data) {
				if (data.status == 200) {
					var item = new Object();
					item = data.data;
					rateHolder.html('<div class="post-rate"><span class="rating-stars" title="评分 ' + item.average + ', 满分 5 星" style="width:' + item.percent + '%"></span></div><div class="piao">' + item.raters + ' 票</div>');
				} else {
					rateHolder.html(history);
					console.log(data.status);
				}
			}
		});
	},
	showMoreComment: function(DOM) {
		commentsHolder = jQuery(".commentlist"),
		commentnavHolder = jQuery('.commentnavholder'),
		id = DOM.data("id"),
		paged = DOM.data("paged"),
		concelLink = jQuery("#cancel-comment-reply-link");
		concelLink.click();
		var ajax_data = {
			action: "loadmorecomment_callback",
			id: id,
			paged: paged
		};
		pureBody.addClass('is-loadingApp');
		jQuery.ajax({
			url: PURE.ajax_url,
			type: "POST",
			data: ajax_data,
			dataType: "json",
			success: function(data) {
				if (data.status == 200) {
					commentsHolder.append(data.data);
					if (data.nav) {
						commentnavHolder.html(data.nav);
					} else {
						commentnavHolder.remove();
					}
					pureBody.removeClass('is-loadingApp');
				} else {
					DOM.html("add");
					DOM.removeAttr("disabled");
				}
			}
		});
	},
	moveForm: function(commId, parentId, respondId, postId) {
		var t = this,
		div,
		comm = t.I(commId),
		respond = t.I(respondId),
		cancel = t.I('cancel-comment-reply-link'),
		parent = t.I('comment_parent'),
		post = t.I('comment_post_ID');
		$cancel.text(cancel_text);
		t.respondId = respondId;
		postId = postId || false;
		if (!t.I('wp-temp-form-div')) {
			div = document.createElement('div');
			div.id = 'wp-temp-form-div';
			div.style.display = 'none';
			respond.parentNode.insertBefore(div, respond)
		} ! comm ? (temp = t.I('wp-temp-form-div'), t.I('comment_parent').value = '0', temp.parentNode.insertBefore(respond, temp), temp.parentNode.removeChild(temp)) : comm.parentNode.insertBefore(respond, comm.nextSibling);
		pureBody.animate({
			scrollTop: jQuery('#respond').offset().top - 180
		},
		400);
		if (post && postId) post.value = postId;
		parent.value = parentId;
		cancel.style.display = '';
		cancel.onclick = function() {
			var t = addComment,
			temp = t.I('wp-temp-form-div'),
			respond = t.I(t.respondId);
			t.I('comment_parent').value = '0';
			if (temp && respond) {
				temp.parentNode.insertBefore(respond, temp);
				temp.parentNode.removeChild(temp);
			}
			this.style.display = 'none';
			this.onclick = null;
			return false;
		};
		try {
			t.I('comment').focus();
		}
		 catch(e) {}
		return false;
	},
	I: function(e) {
		return document.getElementById(e);
	},
	editcode: function() {
		var a = "",
		b = jQuery("#comment").val(),
		start = b.indexOf("<code>"),
		end = b.indexOf("</code>");
		if (start > -1 && end > -1 && start < end) {
			a = "";
			while (end != -1) {
				a += b.substring(0, start + 6) + b.substring(start + 6, end).replace(/<(?=[^>]*?>)/gi, "&lt;").replace(/>/gi, "&gt;");
				b = b.substring(end + 7, b.length);
				start = b.indexOf("<code>") == -1 ? -6: b.indexOf("<code>");
				end = b.indexOf("</code>");
				if (end == -1) {
					a += "</code>" + b;
					jQuery("#comment").val(a)
				} else if (start == -6) {
					myFielde += "&lt;/code&gt;"
				} else {
					a += "</code>"
				}
			}
		}
		var b = a ? a: jQuery("#comment").val(),
		a = "",
		start = b.indexOf("<pre>"),
		end = b.indexOf("</pre>");
		if (start > -1 && end > -1 && start < end) {
			a = a
		} else return;
		while (end != -1) {
			a += b.substring(0, start + 5) + b.substring(start + 5, end).replace(/<(?=[^>]*?>)/gi, "&lt;").replace(/>/gi, "&gt;");
			b = b.substring(end + 6, b.length);
			start = b.indexOf("<pre>") == -1 ? -5: b.indexOf("<pre>");
			end = b.indexOf("</pre>");
			if (end == -1) {
				a += "</pre>" + b;
				jQuery("#comment").val(a)
			} else if (start == -5) {
				myFielde += "&lt;/pre&gt;"
			} else {
				a += "</pre>"
			}
		}
	},
	showSearchForm: function(DOM) {
		var shareContent = '<div id="jumbo-search-container" class="layoutMultiColumn-container"><header class="layoutMultiColumn-header"><form action="" method="get" role="search"><input class="js-search-input textInput textInput--borderless textInput--jumbo" name="s" placeholder="输入搜索内容" autocomplete= "off"></form></header></div>';
		if (DOM.hasClass("is-active")) {
			$("#jumbo-search-container").remove();
			DOM.removeClass("is-active");
		} else {
			DOM.addClass("is-active");
			$("#header-nav").after(shareContent);
			$(".textInput--jumbo").focus();
		}
	},
	backToTop: function() {
		$("html").animate({
			scrollTop: 0
		},
		800);
	},
	addSmily: function(DOM) {
		var myField;
		tag = ' ' + DOM.data("smilies") + ' ';
		if (document.getElementById('comment') && document.getElementById('comment').type == 'textarea') {
			myField = document.getElementById('comment');
		} else {
			return false;
		}
		if (document.selection) {
			myField.focus();
			sel = document.selection.createRange();
			sel.text = tag;
			myField.focus();
		}
		 else if (myField.selectionStart || myField.selectionStart == '0') {
			var startPos = myField.selectionStart;
			var endPos = myField.selectionEnd;
			var cursorPos = endPos;
			myField.value = myField.value.substring(0, startPos)
			 + tag
			 + myField.value.substring(endPos, myField.value.length);
			cursorPos += tag.length;
			myField.focus();
			myField.selectionStart = cursorPos;
			myField.selectionEnd = cursorPos;
		}
		 else {
			myField.value += tag;
			myField.focus();
		}
	},
	editProfile: function(DOM) {
		ssaction = DOM.data("action-value"),
		status = DOM.parent().prev().find('.list-itemInput').val();
		DOM.attr('disabled', "true");
		var ajax_data = {
			action: "profile_edit",
			ssaction: ssaction,
			status: status
		};
		jQuery.ajax({
			url: PURE.ajax_url,
			type: "PUT",
			data: ajax_data,
			dataType: "json",
			success: function(data) {
				createButterbar(data.data);
				DOM.removeAttr("disabled");
			}
		});
	},
	showCommentInfo: function(DOM) {
		var form = jQuery(".info");
		if (form.hasClass("v-hide")) {
			form.removeClass("v-hide");
			DOM.html("收起修改");
		} else {
			form.addClass("v-hide");
			DOM.html("资料修改");
		}
	},
	openUserActions: function(DOM) {
		var userActions = '<div class="popover-inner popover-inner--followButton"><ul class="list list--borderless list--short list--large"><li class="list-item list-item--noPadding"><a class="button--link" href="/me/settings">资料</a></li><li class="list-item list-item--noPadding"><a class="button--link" href="' + PURE.login_out_url + '">注销</a></li></ul></div>';
		LEE.makePopover(DOM, userActions);
	},
	openLoginForm: function(DOM) {
		var userActions = loginForm = '<div class="popover-inner popover-inner--followButton"><a class="login-social__weibo login-social js-action" data-type="sina" data-action="oauthSina">使用微博登录</a><a class="login-social__qq login-social js-action" data-type="qq" data-action="oauthQQ">使用QQ登录</a></div>';
		LEE.makePopover(DOM, loginForm);
	},
	oauthQQ: function() {
		window.open(PURE.oauth_qq, "QQ授权登录", box);
		jQuery(".popover").remove();
	},
	oauthSina: function() {
		window.open(PURE.oauth_sina, "未必授权登录", box);
		jQuery(".popover").remove();
	},
	makePopover: function(DOM, content) {
		var width = DOM.width(),
		height = DOM.height(),
		top = DOM.offset().top + height,
		left = DOM.offset().left,
		direction = (left > 400) ? 'right': 'bottom';;
		if (DOM.hasClass('is-active')) {
			$('.popover').remove();
			DOM.removeClass('is-active');
		} else {
			DOM.addClass('is-active');
			pureBody.append('<div class="popover fade popover--' + direction + '">' + content + '<div class="popover-arrow"></div></div>');
			var popover = jQuery(".popover"),
			pWidth = popover.outerWidth(true),
			pHeight = popover.height();
			if (direction == 'right') {
				popover.css({
					"left": (left - pWidth + width + 15),
					"top": (top + 5)
				});
			} else {
				popover.css({
					"left": (left - (pWidth - width) / 2),
					"top": (top)
				});
			}
		}
	}
};
function clearButterbar() {
	if ($(".butterBar").length > 0) {
		$(".butterBar").remove();
	}
}
function createButterbar(message) {
	clearButterbar();
	pureBody.append('<div class="butterBar butterBar--center"><p class="butterBar-message">' + message + '</p></div>');
	setTimeout("clearButterbar()", 3000);
}
jQuery(document).on("click", ".js-action",
function(e) {
	e.preventDefault();
	$this = jQuery(this),
	action = $this.data("action");
	if (action) {
		LEE[action]($this);
	}
	return false;
});
jQuery(window).scroll(function() {
	var windowH = $(window).height(),
	docHeight = (jQuery(document).height() - windowH),
	$windowObj = jQuery(this),
	st = $windowObj.scrollTop(),
	percentage = 0;
	if (st < defaultScroll && st > 200) {
		$header.addClass('metabar--affixed');
	} else {
		$header.removeClass('metabar--affixed');
	}
	defaultScroll = $windowObj.scrollTop();
	percentage = parseInt((defaultScroll / docHeight) * 6);
	if (backToTop.length > 0) {
		if ($windowObj.scrollTop() > 200) {
			backToTop.addClass('button--show');
		} else {
			backToTop.removeClass('button--show');
		}
		backtoTopCanvas.attr('class', 'sb' + percentage);
	}
})
console.log('QQ:4398929');