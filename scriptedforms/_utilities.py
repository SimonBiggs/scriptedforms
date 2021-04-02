# Scripted Forms -- Making GUIs easy for everyone on your team.
# Copyright (C) 2017 Simon Biggs

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import os
import json
from glob import glob

import numpy as np
import pandas as pd

from ._version import __version__

HERE = os.path.dirname(__file__)


def attempt_to_set_type(df, column, numpy_type):
    try:
        df[column] = df[column].astype(numpy_type)
    except ValueError:
        pass


def _json_table_to_df(json_table):
    table = json.loads(json_table)
    columns = [fields['name'] for fields in table['schema']['fields']]
    types = [fields['type'] for fields in table['schema']['fields']]
    index = table['schema']['primaryKey'][0]

    for column, a_type in zip(columns, types):
        if column != index:
            for row in table['data']:
                is_empty = (
                    row[column] is None or
                    row[column] == "" or
                    row[column] == np.nan
                )
                if is_empty:
                    if a_type == "string":
                        row[column] = ""
                    if a_type == "number" or a_type == "integer":
                        row[column] = np.nan
                    if a_type == "boolean":
                        row[column] = False

    df = pd.DataFrame(
        table['data'],
        columns=columns)

    df.set_index(index, inplace=True)

    for column, a_type in zip(columns, types):
        if column != index:
            if a_type == "string":
                attempt_to_set_type(df, column, np.dtype(str))

            elif a_type == "number":
                attempt_to_set_type(df, column, np.dtype(float))

            elif a_type == "integer":
                attempt_to_set_type(df, column, np.dtype(int))

            elif a_type == "boolean":
                attempt_to_set_type(df, column, np.dtype(bool))

            elif a_type == "datetime":
                attempt_to_set_type(df, column, np.datetime64)

            elif a_type == "duration":
                attempt_to_set_type(df, column, np.timedelta64)

            elif a_type == "any":
                attempt_to_set_type(df, column, 'category')

            else:
                raise ValueError(
                    "Unexpected type, got {}"
                    .format(a_type)
                )

    return df


class _VariableHandler(object):
    def __init__(self, variable_evaluate_map, handlername):
        self.variable_evaluate_map = json.loads(variable_evaluate_map)
        self.handlername = handlername

        self.variables_dict = {
            "_scriptedforms.__version__": __version__
        }

    @property
    def fetch_code(self):
        fetch_code_list = []

        # Need to use double quotes here for the key parameter
        # as in {0}.variables_dict["{1}"] not {0}.variables_dict['{1}']
        # key paramters assume they can use single quotes.
        for key, evaluate in self.variable_evaluate_map.items():
            fetch_code_list.append("""
try:
    {0}.variables_dict["{1}"] = {{"value": {2}, "defined": True}}
except:
    {0}.variables_dict["{1}"] = {{"defined": False}}
""".format(self.handlername, key, evaluate))
        fetch_code_list.append(
            "print({}.variables_json)".format(self.handlername))

        return ''.join(fetch_code_list)

    @property
    def variables_json(self):
        json_string = json.dumps(self.variables_dict)
        json_string = (
            json_string.replace('NaN', 'null')
            .replace('-Infinity', 'null').replace('Infinity', 'null'))
        return json_string


def _print_file(filename):
    with open(filename, 'r') as f:
        contents = f.read()

    print(contents)


def _print_apache():
    _print_file(os.path.join(HERE, 'Apache-2.0'))


def _print_agpl():
    _print_file(os.path.join(HERE, 'LICENSE'))


def _watchdog_path_conversion(paths):
    converted_paths = []

    for path in paths:
        converted_paths += glob(os.path.abspath(path))

    for path in converted_paths:
        if not os.path.exists(path):
            raise AssertionError("The path provided does not exist.")

    return converted_paths
