$(function(){
  var authHash = $('#wrapper').attr('data-hash');
  $.ajax({
    method: 'POST',
    url: '/session/' + authHash + '/',
    data: {
      key: 'value'
    }
  }).done(function(response){
    $('#response-wrapper').text(response);
  });
});