import numpy as np
import pandas as pd

from datetime import datetime
from IPython.display import display, Markdown

display(Markdown(
    'Loaded data.py at {}'
    .format(str(datetime.now()))
))

table = pd.DataFrame(
    columns=['Meas1', 'Meas2', 'Adjust'],
    index=['6MV', '10MV'],
    data=[[6, np.nan, False], [4, 5, False]])

input_types = {
    'Meas1': 'number', 'Meas2': 'number', 'Adjust': 'toggle'
}

display(table)
