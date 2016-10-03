$(function(){
  var apiTicket = $('#wrapper').attr('data-api-ticket');
  var signature = md5(apiTicket + navigator.userAgent);
  $.ajax({
    method: 'POST',
    url: '/session/auth/' + signature + '/',
    data: {}
  }).done(function(response){
    $('#response-wrapper').text(response.accessToken);
  });
});