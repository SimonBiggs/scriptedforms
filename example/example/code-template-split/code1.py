import numpy as np
import pandas as pd

print('loading code...')

table = pd.DataFrame(
  columns=['Meas1', 'Meas2', 'Meas3', 'Avg'],
  index=['6MV', '10MV'],
  data=[[1, np.nan, np.nan, np.nan], [4, 5, np.nan, np.nan]])
