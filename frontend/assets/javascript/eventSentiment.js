const ko = require('knockout');
const { EventSentimentViewModel } = require('./eventSentimentViewModel');

ko.applyBindings(new EventSentimentViewModel());
