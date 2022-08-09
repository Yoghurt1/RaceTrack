import { generateCustomChart } from './charting/customChart';

const ko = require('knockout')
const $ = require('jquery')

export function EventVisualiseViewModel() {
  var self = this;

  var colSpec = config.eventVisualiseViewModel.colSpec

  var disposeRoot = function () {
    return; // Empty function to be replaced with root disposal
  }

  self.shouldShowCompareClass = ko.observable(false);
  self.shouldShowCompareCars = ko.observable(false);

  self.xAxis = ko.observable();
  self.yAxis = ko.observable();
  self.xFunctions = ko.observableArray([]);
  self.yFunctions = ko.observableArray([]);
  self.classes = ko.observableArray(['Loading...']);
  self.carNums = ko.observableArray(['Loading...']);

  $.get({
    url: window.location.pathname + '/classes',
    success: function (data) {
      self.classes.removeAll()
      self.classes.push(...data)
    }
  });

  $.get({
    url: window.location.pathname + '/cars',
    success: function (data) {
      self.carNums.removeAll()
      self.carNums.push(...data)
    }
  });

  self.formatCarNums = function (item) {
    return item != 'Loading...' ? '#' + item : item
  }

  self.showCompareClass = function () {
    $('#compareClassRadio').prop('checked', true).trigger('click')
    self.shouldShowCompareCars(false);
    self.shouldShowCompareClass(true);
  };

  self.showCompareCars = function () {
    $('#compareCarsRadio').prop('checked', true).trigger('click')
    self.shouldShowCompareCars(true);
    self.shouldShowCompareClass(false);
  };

  self.showCompareNone = function () {
    $('#compareNoneRadio').prop('checked', true).trigger('click')
    self.shouldShowCompareCars(false);
    self.shouldShowCompareClass(false);
  };

  self.xAxis.subscribe(function (newValue) {
    if (['time', 'delta'].includes(lookupDataType(newValue))) {
      self.xFunctions.removeAll();
      self.xFunctions.push(...functions);
    } else {
      self.xFunctions.removeAll();
    }
  });

  self.yAxis.subscribe(function (newValue) {
    if (['time', 'delta'].includes(lookupDataType(newValue))) {
      self.yFunctions.removeAll();
      self.yFunctions.push(...functions);
    } else {
      self.yFunctions.removeAll();
    }
  });

  self.generateChart = function () {
    disposeRoot()
    $('#generate').text('Generating...').prop('disabled', true)

    const form = getFormData()
    $.post({
      url: window.location.pathname,
      data: form,
      success: function (data) {
        console.log(data)
        try {
          disposeRoot = generateCustomChart(colSpec, data, form)
        } catch (err) {
          console.error(err)
        } finally {
          $('#generate').text('Generate').prop('disabled', false)
        }
      },
      error: function () {
        $('#generate').text('Generate').prop('disabled', false)
      }
    })
  }

  function lookupDataType(name) {
    for (let i = 0; i < colSpec.length; i++) {
      if (colSpec[i].name === name) {
        return colSpec[i].dtype;
      }
    }
  }

  function getFormData() {
    const rawJson = $('#chartForm').serializeArray();
    const model = {};

    $.map(rawJson, function (n) {
      model[n['name']] = n['value'];
    });

    if (!self.shouldShowCompareCars()) {
      delete model.carCompare1
      delete model.carCompare2
    }

    if (!self.shouldShowCompareClass()) {
      delete model.classCompare
    }

    return model;
  }
}

const functions = [
  'Average',
  'Rolling average',
  'Max',
  'Median',
  'Min'
];
