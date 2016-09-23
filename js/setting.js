;(function($) {
    var $navTab = $('.leftpanel .nav > li:not(.disabled)'),
        $divTab = $('.div-tab'),
        $switch = $('.pure-setting-switch'),
        $upload = $('.pure-setting-upload'),
        $radio  = $('.pure-setting-radio'),
        $progress = $('#progress'),
		$sidepos = $(".sidepos")
        $sliderActive = $('#pure-setting-slider-active'),
        $sliderSource = $('#pure-setting-slider-source'),
		
        $form = $('#pure-form'),
        $save = $('#pure-save'),

        $win = $(window),

        is_ajaxed = false;
	$sidepos.click(function(e){
		e.preventDefault();
		var _this = $(this),
			_rel = _this.attr("rel"),
			_parent = _this.parent(),
			_input = _parent.children("input");
		
		if(!_this.hasClass("current")){			
			_this.parent().find(".sidepos").removeClass("current");
			_this.addClass("current");		
		}
		_input.val(_rel);
		return false;
	});
    $navTab.click(function(event) {
        var $this = $(this),
		I = $navTab.index($this);
        if (!$this.hasClass('active')) {
            var _index = $navTab.index($this);
            $divTab.addClass('hidden').eq(_index).removeClass('hidden');
            $navTab.removeClass('active');
            $this.addClass('active');
			if (window.localStorage) {
			localStorage.currentTab = I
		}
            //$win.scrollTop(0)
        }
    });
	if (window.localStorage) {
		var D = localStorage.currentTab;
		if (D) {
			$navTab.eq(D).click()
		}
	}
    $switch.click(function(event){
        var $this = $(this),
            $input = $("#" + $this.attr('data-id'));

        if (!$this.hasClass('active')) {
            $this.addClass('active');
            $input.val(1);
        }else{
            $this.removeClass('active');
            $input.val(0);
        }

        $input.change()
    });

    $upload.click(function(event){
        var $this = $(this),
            $input = $("#" + $this.attr('data-id')),
            $preview = $("#" + $this.attr('data-id') + "-preview");

        /**
         * 兼容3.5之前版本上传文件的方法
         */
        if( typeof(tb_show) !== "undefined" ){
            tb_show("", global.adminurl + "media-upload.php?type=image&amp;TB_iframe=true");

            window.send_to_editor = function(data) {
                var imgurl = $("img", data).attr("src");
                $preview.html('<img src="' + imgurl + '"/>');
                $input.val(imgurl);
                tb_remove()
            };
        }

        /**
         * 采用 3.5之后的新上传图片方法
         */

        // Create the media frame.
        var file_frame = wp.media.frames.file_frame = wp.media({
            multiple: false  // Set to true to allow multiple files to be selected
        });

        // When an image is selected, run a callback.
        file_frame.on( 'select', function() {
            // We set multiple to false so only get one image from the uploader
            var attachment = file_frame.state().get('selection').first().toJSON();

            // Do something with attachment.id and/or attachment.url here
            var imgurl = attachment.url;
            $preview.html('<img src="' + imgurl + '"/>');
            $input.val(imgurl);
        });

        // Finally, open the modal
        file_frame.open();
    });

    $radio.click(function(event){
        var $this = $(this);

        if( !$this.hasClass('checked') ){
            $this.parent().children('.pure-setting-radio').removeClass('checked');

            $this.addClass('checked');

            var $elem = $('#' + $this.attr('data-id')),
                val = $this.attr('data-value');

            $elem.val(val).change() 
        }
    });

    $save.click(function(event){
        if( is_ajaxed ) return;

        $.ajax({
            url: global.ajaxurl,
            data: $form.serialize() + '&action=pure_setting',
            type: 'POST',
            beforeSend: function(){
                is_ajaxed = true;
                $progress.show();
            },
            success: function(){
                is_ajaxed = false;

                $progress.addClass('success').children('.spinner-text').text('成功保存主题设置!');

                setTimeout(function(){
                    $progress.hide().removeClass('success');
                }, 1000*3)
            },
            error: function(){
                is_ajaxed = false;

                $progress.addClass('error').children('.spinner-text').text('主题设置保存失败, 请稍候重试!');

                setTimeout(function(){
                    $progress.hide().removeClass('error');
                }, 1000*3)
            }
        })
    });

    $sliderActive.on('change', function(){
        sliderActiveInit();
    });

    sliderActiveInit();

    function sliderActiveInit(){
        var active_val = parseInt($sliderActive.val()),
            source_val = $sliderSource.val();

        if( !active_val ){
            $('#tab-slider tbody > tr:gt(0)').hide()
        }else{
            $('#tab-slider tbody > tr:gt(0)').show();
        }
    }

})(jQuery);