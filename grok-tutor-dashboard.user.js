// ==UserScript==
// @name        NCSS Tutor Dashboard Tools
// @namespace   swalladge.net
// @icon        https://assets.learn.groklearning-cdn.com/static/images/favicon.png
// @description Tutor tools enhancements
// @include     https://groklearning.com/tutor-messaging/*
// @include     https://groklearning.com/learn/*
// @include     https://groklearning.com/view-submissions/*
// @version     2.3.0
// @grant       none
// @author      Samuel Walladge <samuel@swalladge.net>
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==


// this function injected into the page so it runs in the correct context
function main() {
  window.addEventListener('load', () => {
    // check if we're on the triage/dashboard page
    if (/^\/tutor-messaging\/.*/.test(window.location.pathname)) {
      // add button to turn *off* auto-assign for all
      let btn2 = $('<a class="add-new-preference-btn"><span class="icon icon-bell2"></span></a>');
      $('.component-container.tutor-preferences > h4').append(btn2);
      btn2.click(() => {
        $("a:contains('Disable auto-assign mode')").each(function() { this.click(); });
      });

      // add button to turn on auto-assign for all
      let btn = $('<a class="add-new-preference-btn"><span class="icon icon-bell3"></span></a>');
      $('.component-container.tutor-preferences > h4').append(btn);
      btn.click(() => {
        $("a:contains('Enable auto-assign mode')").each(function() { this.click(); });
      });

      // create a custom box and add custom buttons to that (so that dynamic loading doesn't clobber changes we make)
      let customBox = $('<div class="component-container"><h4>Custom Controls</h4></div>');
      $("div.component-container.tutor-preferences").after(customBox);

      // show backlog stats in sidebar
      customBox.append($('<h4>Stats</h4><p id="backlog-len">backlog length loading...</p>'))
      let updateBacklogStats = () => {
        let lenBacklog = $('.thread-group.available > .thread-box').length;
        let backlogMsg = '';
        if (lenBacklog == 0) {
          backlogMsg = 'Backlog is clear! 🎉';
        } else if (lenBacklog < 6) {
          backlogMsg = `Backlog length: ${lenBacklog} 😎`;
        } else if (lenBacklog < 11) {
          backlogMsg = `Backlog length: ${lenBacklog} 😅`;
        } else if (lenBacklog < 21) {
          backlogMsg = `Backlog length: ${lenBacklog} 😟`;
        } else if (lenBacklog < 31) {
          backlogMsg = `Backlog length: ${lenBacklog} 😢`;
        } else {
          backlogMsg = `Backlog length: ${lenBacklog} 😱`;
        }
        $('#backlog-len').html(backlogMsg);

      };
      // kick it off and schedule regularly
      window.setInterval(updateBacklogStats, 3000);

      // show/hide passed threads in replied or closed section
      // (this is to help find closed threads where students haven't passed yet)
      customBox.append($('<h5>My Threads / Replied or closed</h5>'));
      let hidePassedBtn = $('<a class="btn btn-default btn-sm thread-action">Hide passed</a>');
      customBox.append(hidePassedBtn);
      hidePassedBtn.click(() => {
        $(".thread-group > h4:contains('Replied or closed')").parent().find(".passed").parent().parent().hide();
      });
      let showPassedBtn = $('<a class="btn btn-default btn-sm thread-action">Show passed</a>');
      customBox.append(showPassedBtn);
      showPassedBtn.click(() => {
        $(".thread-group > h4:contains('Replied or closed')").parent().find(".passed").parent().parent().show();
      });

      // desktop notifications (based on script by @forkbomb)
      // As of Feb 2021, Handlebars is no longer in global scope, making this difficult to implement.
      // Leave it here anyway, in case it is put back. :)
      if (window.Handlebars !== undefined) {
        Notification.requestPermission();
        Handlebars.templates['__chatThreadAssignment'] = Handlebars.templates['chat-thread-assignment-notification-popup'];
        Handlebars.templates['chat-thread-assignment-notification-popup'] = function() {
          new Notification(
            "Grok: new chat thread offer!",
            {
              'icon': 'https://static.groklearning-cdn.com/static/images/favicon.png'
            });
          return Handlebars.templates['__chatThreadAssignment'].apply(this, arguments);
        };
        Handlebars.templates['__chatThread'] = Handlebars.templates['chat-thread-notification-popup'];
        Handlebars.templates['chat-thread-notification-popup'] = function() {
          new Notification(
            "Grok: chat thread notification!",
            {
              'icon': 'https://static.groklearning-cdn.com/static/images/favicon.png'
            });
          return Handlebars.templates['__chatThread'].apply(this, arguments);
        };
        Handlebars.templates['__chatThreadState'] = Handlebars.templates['chat-thread-state-change-notification-popup'];
        Handlebars.templates['chat-thread-state-change-notification-popup'] = function() {
          new Notification(
            "Grok: chat thread state change!",
            {
              'icon': 'https://static.groklearning-cdn.com/static/images/favicon.png'
            });
          return Handlebars.templates['__chatThreadState'].apply(this, arguments);
        };
      }

    // check if we're on a slide in the course (blue view)
    } else if (/^\/learn\/.*/.test(window.location.pathname)) {
      let copySlide = (withTitle) => {
        let inner = () => {
          let url = window.location.href;

          let title;
          if (withTitle) {
            title = $('#slide-title').text();
          } else {
            title = 'this slide';
          }

          let text = '[' + title + '](' + url + ')';
          navigator.clipboard.writeText(text);
        };
        return inner;
      };

      // Adds a button to copy the slide url as a markdown link.
      let copyBtn = $('<a class="action"><span class="icon icon-copy"></span><span class="title">Copy mkd link</span></a>');
      $('#action-bar-menu-left').append(copyBtn);
      copyBtn.click(copySlide(false));

      // Adds a button to copy the slide url as a markdown link (this time with
      // the slide title).
      let copyBtn2 = $('<a class="action"><span class="icon icon-copy"></span><span class="title">Copy mkd link (title)</span></a>');
      $('#action-bar-menu-left').append(copyBtn2);
      copyBtn2.click(copySlide(true));

    // check if we're on the red tutoring view
    } else if (/^\/view-submissions\/.*/.test(window.location.pathname)) {

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


      let copySlide = (withTitle) => {
        let inner = () => {
          let link = $("a:contains('View slide in course')");
          if (link.length !== 1) { return; }
          let url = link[0].href;

          let title;
          if (withTitle) {
            title = $('#slide-title').text();
          } else {
            title = 'this slide';
          }

          let text = '[' + title + '](' + url + ')';
          navigator.clipboard.writeText(text);
        };
        return inner;
      };

      // Adds a button to copy the slide url as a markdown link.
      let copyBtn = $('<a class="action"><span class="icon icon-copy"></span><span class="title">Copy mkd link</span></a>');
      $('#action-bar-menu-left').append(copyBtn);
      copyBtn.click(copySlide(false));

      // Adds a button to copy the slide url as a markdown link (this time with
      // the slide title).
      let copyBtn2 = $('<a class="action"><span class="icon icon-copy"></span><span class="title">Copy mkd link (title)</span></a>');
      $('#action-bar-menu-left').append(copyBtn2);
      copyBtn2.click(copySlide(true));
    }
  });
}


var script = document.createElement('script');
script.appendChild(document.createTextNode('('+ main +')();'));
(document.body || document.head || document.documentElement).appendChild(script);
