export enum MessageClass {
  initialise_directory = 1,
  service_registration = 2,
  service_deregistration = 3,
  service_data = 4,
  directory_listing = 5,
  schedule_listing = 6,
  analysis_data = 7,
  service_data_compressed = 8,
  analysis_data_compressed = 9,
  recording_listing = 10
}

export enum FlagStatus {
  CAUTION = 9,
  CHEQUERED = 3,
  CODE_60 = 6,
  CODE_60_ZONE = 12,
  FCY = 5,
  GREEN = 1,
  NONE = 0,
  RED = 10,
  SC = 8,
  SLOW_ZONE = 11,
  VSC = 7,
  WHITE = 2,
  YELLOW = 4
}

export enum ChartFunction {
  average = 'Average',
  rolling_average = 'Rolling average',
  max = 'Max',
  median = 'Median',
  min = 'Min'
}

export enum ChartType {
  line = 'Line',
  line_smooth = 'Line (smoothed)',
  step_line = 'Step line',
  column = 'Column',
  box = 'Box plot'
}
