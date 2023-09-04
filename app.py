from flask import Flask, render_template, request, send_from_directory
import datetime
import pytz
import os

app = Flask(__name__)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/', methods=['GET'])
def check_friday():
    cheat = request.args.get('secretcheat')
    if cheat is None:
        cheat = ''
    local_timezone = pytz.timezone('Europe/Stockholm')
    current_date = datetime.datetime.now(local_timezone)
    day_of_week = current_date.weekday()
    current_time = current_date.time()

    if (current_time.hour >= 17) or (day_of_week >= 4 and current_time.hour >= 16) or (day_of_week >= 5) or cheat.lower() == 'givbeerplz':
        message = "It's beer o'clock :-)"
    else:
        message = "It's not beer o'clock yet :-("

    return render_template('index.html', message=message)

if __name__ == '__main__':
    app.run(port=80, host="0.0.0.0", debug=True)

