$(document).on("pageinit", ".page_body", function(event) {
  $(document).bind("contextmenu",function(e){   
    return false;   
  });
  localStorage.mURL="www.digital-messages.net";
  //localStorage.mURL="192.168.1.108";
  //localStorage.mURL="37.187.71.48";
  $('.nav_bar').on('vmousedown','a',function(){
    $(this).children('img').css({opacity:0.5}).animate({opacity:1},200);
  });
  var navbarHeight=$('.nav_bar').height(),
  titleHeight=$('.nav_bar h3').height();
  var marginTop = (navbarHeight/2-titleHeight/2)+'px';
  $('.nav_bar h3').css("margin-top",marginTop);
});

function sendAjax(url, data, success, error) {
  $.ajax({
    url: 'http://'+localStorage.mURL+url,
    type:'POST',
    timeout: 20000,
    dataType:'json',
    data: data,
    success: success,
    error: error,
  });
}

function showSuccess(pageid, message){
  $("<div class='post_success'>"+
    "<p>"+message+"</p>"+
    "<div>"+
    "<p style='color: white; text-decoration: none; font-weight: normal; text-shadow:none;'>确定</p>"+
    "</div>"+
    "</div>"+
    "<script>"+
    "$('.post_success div').click(function(){"+
      "$('.post_success').fadeOut().remove();"+
      "$.mobile.changePage('index.html',{transition: 'pop'});"+
      "});"+
  "</script>"
  ).hide().appendTo(pageid).show();
}

function showError(pageid, message){
  $("<div class='post_failed'>"+
    "<p>"+message+"</p>"+
    "<div>"+
    "<p style='color: white; text-decoration: none; font-weight: normal; text-shadow:none;'>确定</p>"+
    "</div>"+
    "</div>"+
    "<script>"+
    "$('.post_failed div').click(function(){"+
      "$('.post_failed').fadeOut().remove();"+
      "});"+
  "</script>"
  ).hide().appendTo(pageid).show();
}

function displayNetworkError(pageid) {
  setTimeout(function(){
    $('#popupDelay').remove();
    $("<div data-role='popup' id='popupDelay' data-theme='b'>"+
      "<p>网络没信号了o(>_<)o</p>"+
      "</div>").appendTo(pageid);
    $('#popupDelay').css({opacity:0.8}).popup({transition:"pop"}).popup('open');
    setTimeout(function(){$('#popupDelay').popup('close')},3000);
  },500);
}

function loginAction() {
  if(localStorage.certificate) {
    var data = {
      username: (JSON.parse(localStorage.certificate)).username,
      password: (JSON.parse(localStorage.certificate)).password
    };
    sendAjax('/app_login',data, function(result){
      if(result.result=="error") {
        localStorage.removeItem('certificate');
      }
    }, function(jqXHR, textStatus, errorThrown){});
  }
}

function logoutAction() {
  localStorage.removeItem('certificate');
  sendAjax('/app_logout',"");
}

function removeCache() {
  $('#information_catagory_page').remove();
  $('#news_page').remove();
  $('#user_post_view_page').remove();
}

function clearbufferAction() {
  localStorage.removeItem('informationFindJobCatagory');
  localStorage.removeItem('informationFindHouseCatagory');
  localStorage.removeItem('informationMoveHouseCatagory');
  localStorage.removeItem('informationBusinessCatagory');
  localStorage.removeItem('informationTicketCatagory');
  localStorage.removeItem('informationLawCatagory');
  localStorage.removeItem('InformationDetails');
  localStorage.removeItem('Exchange');
  localStorage.removeItem('NewsCatagory');
  localStorage.removeItem('NewsIDBuffer');
  localStorage.removeItem('NewsDetails');
  localStorage.removeItem('UserPostCatagory');
  localStorage.removeItem('UserPostDetails');
  localStorage.removeItem('LearningDetails');
  localStorage.removeItem('LearningBeginnerCatagory');
  localStorage.removeItem('LearningSentenceCatagory');
  localStorage.removeItem('LearningTestCatagory');
  localStorage.removeItem('LearningVocabularyCatagory');
  localStorage.removeItem('LearningArticleCatagory');
  localStorage.removeItem('informationFindJobCatagoryCheckDate');
  localStorage.removeItem('informationFindHouseCatagoryCheckDate');
  localStorage.removeItem('informationMoveHouseCatagoryCheckDate');
  localStorage.removeItem('informationBusinessCatagoryCheckDate');
  localStorage.removeItem('informationTicketCatagoryCheckDate');
  localStorage.removeItem('informationLawCatagoryCheckDate');
  localStorage.removeItem('UserPostCatagoryCheckDate');
  localStorage.removeItem('NewsCatagoryCheckDate');
  localStorage.removeItem('LearningBeginnerCheckDate');
  localStorage.removeItem('LearningSentenceCheckDate');
  localStorage.removeItem('LearningTestCheckDate');
  localStorage.removeItem('LearningVocabularyCheckDate');
  localStorage.removeItem('LearningArticleCheckDate');
}
