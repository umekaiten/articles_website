
// **************************************************
// navbar:
// **************************************************

// make navbar fixed position when scroll down:
$(window).on('scroll', function () {
    
    var navbar = $('.navbar_container');
    var scrolled_area = $(window);

    var scrolled_area_y_coordinate = scrolled_area.scrollTop();

    // console.log('');
    // console.log('scrolled_area_y_coordinate: ' + scrolled_area_y_coordinate);
    // console.log('navbar_y_coordinate: ' + navbar_y_coordinate);
    // console.log('');
    
    if ( scrolled_area_y_coordinate > 0) {

        navbar.addClass('top_sticky');
        $('.navbar_placeholder').css('height', navbar.outerHeight());

    } else {

        navbar.removeClass('top_sticky');
        $('.navbar_placeholder').css('height', '0');

    }

});

// **************************************************
// posts expand and collapse:
// **************************************************

var expand_all = true;

$('.toggle_view_button').on('click', function () {

    if (expand_all) {

        expand_all = false;
        $('.post_content').hide();
        $('.post_date').hide();
        $(this).text('expand all');

    } else {

        expand_all = true;
        $('.post_content').show();
        $('.post_date').show();
        $(this).text('collapse all');

    }
    

});

$('.post_title').on('click', function () {

    var a = $(this).closest('.post_card').find('.post_content').toggle();
    var a = $(this).closest('.post_card').find('.post_date').toggle();

});