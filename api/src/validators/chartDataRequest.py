from wtforms import Form, StringField, validators


class ChartDataRequest(Form):
    uuid = StringField("UUID", [validators.InputRequired(), validators.UUID()])
    xAxis = StringField("xAxis", [validators.InputRequired()])
    yAxis = StringField("yAxis", [validators.InputRequired()])
    xFunction = StringField("xFunction", [validators.Optional()])
    yFunction = StringField("yFunction", [validators.Optional()])
    classCompare = StringField("classCompare", [validators.Optional()])
    carCompare1 = StringField("carCompare1", [validators.Optional()])
    carCompare2 = StringField("carCompare2", [validators.Optional()])
