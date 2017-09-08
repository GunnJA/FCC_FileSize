// client-side js
// run by the browser each time your view template is loaded

// by default, you've got jQuery,
// add other scripts at the bottom of index.html

$(function() {
  console.log('hello world :o');
  
  $.get('/urls', function(urls) {
    console.log(urls);
    $.each(urls, function(i, value) {
      let url = urls[i];
      let pth = url["path"];
      let qID = url["quickID"];
      $('<li></li>').text(qID + " - " +pth).appendTo('ul#dreams');
    });
  });

  $('form').submit(function(event) {
    event.preventDefault();
    var dream = $('input').val();
    $.post('/dreams?' + $.param({dream: dream}), function() {
      $('<li></li>').text(dream).appendTo('ul#dreams');
      $('input').val('');
      $('input').focus();
    });
  });

});

const $main = $("main p");

