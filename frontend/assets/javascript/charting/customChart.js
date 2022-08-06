import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';

export function generateCustomChart(colSpec, chartData, chartInfo) {
  const root = am5.Root.new('customChart');
  root.setThemes([
    am5themes_Dark.new(root)
  ]);

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: 'zoomXY',
      wheelZoomPositionX: 1
    })
  );

  const xType = lookupDataType(colSpec, chartInfo.xAxis);
  const yType = lookupDataType(colSpec, chartInfo.yAxis);

  const xAxis = chart.xAxes.push(generateXAxis(root, xType));
  const yAxis = chart.yAxes.push(generateYAxis(root, yType));

  if (xType === 'text') {
    if (!chartInfo.carCompare1 && !chartInfo.carCompare2 && !chartInfo.classCompare) {
      xAxis.data.setAll(chartData)
    } else {
      const xData = Object.keys(chartData).map(key => {
        return {
          'x': key
        }
      })
      xAxis.data.setAll(xData)
    }

    xAxis.get('renderer').labels.template.setAll({
      oversizedBehavior: 'wrap'
    });
  }

  if (yType === 'text') {
    if (!chartInfo.carCompare1 && !chartInfo.carCompare2 && !chartInfo.classCompare) {
      yAxis.data.setAll(chartData)
    } else {
      const yData = Object.keys(chartData).map(key => {
        return {
          'y': key
        }
      })
      yAxis.data.setAll(yData)
    }

    yAxis.get('renderer').labels.template.setAll({
      oversizedBehavior: 'wrap'
    });
  }

  const legend = chart.children.push(am5.Legend.new(root, {
    centerY: am5.p0,
    y: am5.p0,
    x: am5.percent(80),
    layout: root.verticalLayout,
    height: am5.percent(25),
    verticalScrollbar: am5.Scrollbar.new(root, {
      orientation: 'vertical'
    })
  }));

  if (!chartInfo.carCompare1 && !chartInfo.carCompare2 && !chartInfo.classCompare) {
    const settings = generateSeriesSettings(root, xType, yType, xAxis, yAxis, chartInfo)

    switch (chartInfo.chartType) {
      case 'Line':
        chart.series.push(generateSeries(am5xy.LineSeries, chartData, root, settings, xType, yType))
        break;
      case 'Line (smoothed)':
        chart.series.push(generateSeries(am5xy.SmoothedXLineSeries, chartData, root, settings, xType, yType))
        break;
      case 'Step line':
        chart.series.push(generateSeries(am5xy.StepLineSeries, chartData, root, settings, xType, yType))
        break;
      case 'Column':
        chart.series.push(generateSeries(am5xy.ColumnSeries, chartData, root, settings, xType, yType))
        break;
      case 'Box plot':
        chart.series.push(generateSeries(am5xy.CandlestickSeries, chartData, root, settings, xType, yType))
        break;
    }

    legend.data.setAll(chart.series.values)
  } else {
    let chartType;
    let series = [];

    switch (chartInfo.chartType) {
      case 'Line':
        chartType = am5xy.LineSeries
        break;
      case 'Line (smoothed)':
        chartType = am5xy.SmoothedXLineSeries
        break;
      case 'Step line':
        chartType = am5xy.StepLineSeries
        break;
      case 'Column':
        chartType = am5xy.ColumnSeries
        break;
      case 'Box plot':
        chartType = am5xy.CandlestickSeries
        break;
    }

    for (const [key, value] of Object.entries(chartData)) {
      const settings = generateSeriesSettings(root, xType, yType, xAxis, yAxis, chartInfo, key)
      series.push(generateSeries(chartType, value, root, settings, xType, yType))
    }

    chart.series.setAll(series)
    legend.data.setAll(series)
  }

  const durationFields = []

  if (['time', 'delta'].includes(xType)) {
    durationFields.push('x')
  }

  if (['time', 'delta'].includes(yType)) {
    durationFields.push('y')
  }

  root.durationFormatter.setAll({
    baseUnit: 'second',
    durationFormat: 'mm:ss.SSS',
    durationFields: durationFields
  });

  chart.set('cursor', am5xy.XYCursor.new(root, {}));

  return () => root.dispose()
}

function lookupDataType(colSpec, name) {
  for (let i = 0; i < colSpec.length; i++) {
    if (colSpec[i].name === name) {
      return colSpec[i].dtype;
    }
  }
}

function generateProcessorSettings(xType, yType) {
  const numeric = []

  if (['numeric', 'delta', 'time'].includes(xType)) {
    numeric.push('x')
  }

  if (['numeric', 'delta', 'time'].includes(yType)) {
    numeric.push('y')
  }

  return Object.assign({}, {
    numericFields: numeric
  })
}

function generateXAxis(root, type) {
  if (type === 'text') {
    return am5xy.CategoryAxis.new(root, {
      categoryField: 'x',
      renderer: am5xy.AxisRendererX.new(root, {})
    })
  } else if (type === 'time' || type === 'delta') {
    return am5xy.DurationAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {})
    })
  }

  return am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererX.new(root, {})
  })
}

function generateYAxis(root, type) {
  if (type === 'text') {
    return am5xy.CategoryAxis.new(root, {
      categoryField: 'y',
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  } else if (type === 'time' || type === 'delta') {
    return am5xy.DurationAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  }

  return am5xy.ValueAxis.new(root, {
    renderer: am5xy.AxisRendererY.new(root, {})
  })
}

function generateSeriesSettings(root, xType, yType, xAxis, yAxis, chartInfo, key = null) {
  const seriesSettings = {
    name: key || 'Custom chart',
    xAxis: xAxis,
    yAxis: yAxis,
    tooltip: am5.Tooltip.new(root, {
      labelText: `${chartInfo.xAxis}: {` + (xType === 'text' ? 'categoryX' : 'valueX') + `}\n${chartInfo.yAxis}: {valueY.formatDuration()}`
    }),
    legendLabelText: '{name}',
    legendRangeLabelText: '{name}'
  }

  if (xType === 'text') {
    Object.assign(seriesSettings, { categoryXField: 'x' })
  } else {
    Object.assign(seriesSettings, { valueXField: 'x' })
  }

  if (yType === 'text') {
    Object.assign(seriesSettings, { categoryYField: 'y' })
  } else {
    Object.assign(seriesSettings, { valueYField: 'y' })
  }

  return seriesSettings
}

function generateSeries(chartType, chartData, root, settings, xType, yType) {
  const series = chartType.new(root, settings)
  series.data.processor = am5.DataProcessor.new(root, generateProcessorSettings(xType, yType))
  series.data.setAll(chartData)
  return series
}
