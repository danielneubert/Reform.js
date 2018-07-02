$(document).ready(function() {

  var reform = $('section form').reform({ debugMode: true });

  reform.on('rf-send-before', function(e, parent) {
    $(parent).parent().find('div.resultSet').remove();
  });

  reform.on('rf-send-after', function(e, parent, result) {
    $(parent).parent().find('div.resultSet').remove();
    $(parent).parent().append('<div class="resultSet">' + JSON.stringify(result) + '</div>');
  });

  $.ajax({
    type: 'get',
    url: './destination.json',
    data: []
  }).done(function(resultData) {
    var finalUrl;
    try {
      var resultJson = JSON.parse(resultData);
      if (typeof resultJson.url === 'string') {
        finalUrl = resultJson.url;
      }
    } catch(e) {
      console.warn('Could not load destination.json correctly.');
    }
    $('form').attr('action', finalUrl);
  });

});