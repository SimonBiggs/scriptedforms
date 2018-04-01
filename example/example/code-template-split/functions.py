from datetime import datetime
from IPython.display import display, Markdown

display(Markdown(
    'Loaded functions.py at {}'
    .format(str(datetime.now()))
))


def increment(a_table):
    a_table.loc['6MV', 'Meas1'] += 1
