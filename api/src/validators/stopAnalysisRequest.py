from wtforms import Form, StringField, validators


class StopAnalysisRequest(Form):
    uuid = StringField("UUID", [validators.InputRequired(), validators.UUID()])
