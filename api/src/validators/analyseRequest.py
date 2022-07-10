from wtforms import Form, StringField, validators


class AnalyseRequest(Form):
    uuid = StringField("UUID", [validators.InputRequired(), validators.UUID()])
    query = StringField("Query", [validators.InputRequired()])
