import { generateSentimentChart } from './charting/sentimentChart';

const $ = require('jquery');
const ko = require('knockout');

export function EventSentimentViewModel() {
  var self = this
  const chartData = config.eventSentimentViewModel.data || {}

  generateSentimentChart(chartData);
  const INTERVAL = 5000;
  var currentReq = null;
  var timeout = null;

  self.messages = ko.observableArray([]);

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
