from datetime import datetime

import pandas as pd

from IPython.display import display, Markdown

display(Markdown(
    'Loaded variable-table.py at {}'
    .format(str(datetime.now()))
))

input_types_1 = {
    '1st': 'toggle',
    '3rd': 'number',
    '4th': 'dropdown',
    '5th': 'dropdown',
    '6th': 'readonly'
}

input_types_2 = {
    '1st': 'tick',
    '2nd': 'string',
    '3rd': 'readonly',
    '4th': 'readonly',
    '5th': 'readonly',
    '6th': 'readonly'
}

dropdown_items = {
  '4th': ['apple', 'orange', 'pear'],
  '5th': {
    'a': ['sally', 'margaret', 'annita'],
    'b': ['george', 'philip', 'simpson'],
    'c': ['red', 'green', 'blue']
  }
}

table = None
table_other = None


def load_table():
    global table
    global table_other
    table = pd.read_csv('variable-table.csv', index_col=0)

    table_other = pd.DataFrame(
        data=[], columns=table.columns, index=table.index)
    display(Markdown(
        'Loaded variable-table.csv at {}'
        .format(str(datetime.now()))
    ))
