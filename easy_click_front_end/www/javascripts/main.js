$(document).on("pageinit", ".page_body", function(event) {
  $(document).bind("contextmenu",function(e){   
    return false;   
  });
  $(".login_reg_selector").hide();
  $("[href='#login_reg_selector']").click(function() {
    if ($(".login_reg_selector").is(":visible")) {
      $(".login_reg_selector").fadeOut();
    } else {
      $(".login_reg_selector").fadeIn();
    }
  });
  $('.post_success div').click(function(){
    $('.post_success').fadeOut();
  });
  $('.post_failed div').click(function(){
    $('.post_failed').fadeOut();
  });
  $('.nav_bar').on('vmousedown','a',function(){
    $(this).children('img').css({opacity:0.5}).animate({opacity:1},500);
  });
});