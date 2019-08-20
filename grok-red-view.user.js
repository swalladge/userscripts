// ==UserScript==
// @name        NCSS Tutor Red View
// @namespace   swalladge.net
// @icon        https://static.groklearning-cdn.com/static/images/favicon.png
// @description tutor red view enhancements
// @include     https://groklearning.com/view-submissions/*
// @version     1.1.0
// @grant       none
// @author      Samuel Walladge <samuel@swalladge.net>
// ==/UserScript==

// this function injected into the page so it runs in the correct context
function main() {


  // Adds a button to hide PII in the rare case when you need to get a
  // screenshot.
  let hidePII = () => {
    $("div.chat-post.student span.name").html("Student Name");
    $("div.chat-post.student img.avatar").attr("src", "https://www.gravatar.com/avatar/55502f40dc8b7c769880b10874abc9d0?s=64&r=g&d=retro");
    $(".tutoring-user-details").html("<strong>Student Name</strong> (Student at Placeholder School)");
  };

  let btn = $('<a class="action"><span class="icon icon-user"></span><span class="title">Hide PII</span></a>');
  $('#action-bar-menu-left').append(btn);
  btn.click(hidePII);

  // Adds a button to copy the slide url as a markdown link.
  let copySlide = () => {
    let link = $("a:contains('View slide in course')");
    console.trace(link);
    if (link.length !== 1) { return; }
    let url = link[0].href;
    let text = '[this slide](' + url + ')';
    console.trace(text);
    navigator.clipboard.writeText(text);
  };
  let copyBtn = $('<a class="action"><span class="icon icon-copy"></span><span class="title">Copy mkd link</span></a>');
  $('#action-bar-menu-left').append(copyBtn);
  copyBtn.click(copySlide);
}


var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);



