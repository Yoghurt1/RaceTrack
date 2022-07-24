const $ = require('jquery');
const ko = require('knockout');

export function EventSentimentViewModel() {
  const INTERVAL = 5000;
  var currentReq = null;
  var timeout = null;

  this.messages = ko.observableArray([]);

  const fetchMessages = function () {
    currentReq = $.get({
      url: window.location.pathname + '/messages',
      success: function (data) {
        console.log(data)
      }
    });

    currentReq
      .done(setMessages)
      .always(scheduleFetch);
  };

  const setMessages = function (data) {
    console.log(data);
    this.messages(data);
  };

  const scheduleFetch = function () {
    if (currentReq) {
      currentReq.abort();
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    currentReq = null;
    timeout = setTimeout(fetchMessages, INTERVAL);
  };

  fetchMessages();
}
