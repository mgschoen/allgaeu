$(function(){
  var authHash = $('#wrapper').attr('data-hash');
  $.ajax({
    method: 'POST',
    url: '/session/abc', //+ authHash + '/',
    data: {
      key: 'value'
    }
  }).done(function(response){
    $('#response-wrapper').text(response);
  });
});