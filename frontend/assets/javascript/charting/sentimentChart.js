import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Dark from '@amcharts/amcharts5/themes/Dark';

export function generateSentimentChart(chartData) {
  const root = am5.Root.new('sentimentChart')
  root.setThemes([
    am5themes_Dark.new(root)
  ])

  const sentimentChart = root.container.children.push(
    am5xy.XYChart.new(root, {})
  );

  const yAxis = sentimentChart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {})
    })
  );

  const timeAxis = sentimentChart.xAxes.push(
    am5xy.GaplessDateAxis.new(root, {
      renderer: am5xy.AxisRendererX.new(root, {}),
      baseInterval: {
        timeUnit: 'second',
        count: 1
      }
    })
  );

  const valueSeries = sentimentChart.series.push(
    am5xy.SmoothedXLineSeries.new(root, {
      name: 'Sentiment',
      valueXField: 'time',
      valueYField: 'sentiment',
      xAxis: timeAxis,
      yAxis: yAxis,
      tooltip: am5.Tooltip.new(root, {
        labelText: '[bold]{name}[/]\n{valueX.formatDate("HH:mm:ss")}: {valueY}'
      })
    })
  );

  sentimentChart.set('stockSeries', valueSeries);

  valueSeries.data.processor = am5.DataProcessor.new(root, {
    numericFields: ['sentiment'],
    dateFields: ['time'],
    dateFormat: 'i'
  })

  sentimentChart.set('cursor', am5xy.XYCursor.new(root, {}));

  valueSeries.data.setAll(chartData)
}
