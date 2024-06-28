;(function($) {
    $.ajax({
        url: pure_theme.ajaxurl,
        type: 'POST',
        data: {
            action: 'pure_check_update',
            nonce: pure_theme.nonce
        },
        dataType: 'json',
        success: function(json){
            if( json.status == 200 && json.message == 1){
                var $mmmA = $('#toplevel_page_mirana-setting a.menu-top, #toplevel_page_mirana-setting a[href="admin.php?page=mirana/update"]'),

                    $elem = $('<i></i>').appendTo($mmmA);

                $mmmA.css({
                    'position': 'relative'
                });

                $elem.css({
                    'width': '8px',
                    'height': '8px',
                    'border-radius': '50%',
                    'position': 'absolute',
                    'right': '10px',
                    'top': '50%',
                    'margin-top': '-4px',
                    'background': '#ee3930'
                })
            }
        }
    })
})(jQuery);
QTags.addButton('quote','quote','<blockquote>','</blockquote>','quote');