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

});

const $searchInput = $("#searchInput");
const $offsetInput = $("#offsetInput");
const $searchButton = $("#searchButton");
const $recentButton = $("#recentButton");
const $main = $("main");

$searchButton.on("click",function(event) {
  event.preventDefault();
  let query = $searchInput.val();
  $.get(`/search/${query}?offset=${$offsetInput.val()}`, function(data) {
    $main.empty();
    $.each(data, function(i, value) {
      $main.append(`<li><a href="${value.link}">${value.htmlTitle}</li>`);    
    });
  });
});

$recentButton.on("click",function(event) {
  event.preventDefault();
  $.get('/recent', function(data) {
    $main.empty();
    let len = data.length;
    console.log(data.length);
    for (let i = (len - 10); i < len; i += 1) {
      let value = data[i];
      $main.prepend(`<li>${value.query}</li>`);
    }
  });
});