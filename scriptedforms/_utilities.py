# Scripted Forms -- Making GUIs easy for everyone on your team.
# Copyright (C) 2017 Simon Biggs

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version (the "AGPL-3.0+").

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License and the additional terms for more
# details.

# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

# ADDITIONAL TERMS are also included as allowed by Section 7 of the GNU
# Affrero General Public License. These aditional terms are Sections 1, 5,
# 6, 7, 8, and 9 from the Apache License, Version 2.0 (the "Apache-2.0")
# where all references to the definition "License" are instead defined to
# mean the AGPL-3.0+.

# You should have received a copy of the Apache-2.0 along with this
# program. If not, see <http://www.apache.org/licenses/LICENSE-2.0>.


import os
import json
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

        self.timestamp = dict()
        for key in self.variable_evaluate_map:
            self.timestamp[key] = None

        self.userid = dict()
        for key in self.variable_evaluate_map:
            self.userid[key] = None

        self.signature = dict()
        for key in self.variable_evaluate_map:
            self.signature[key] = None

        self.value = dict()
        self.defined = dict()

    @property
    def fetch_code(self):
        fetch_code_list = ["{}.value = dict()\n".format(self.handlername)]
        for key, evaluate in self.variable_evaluate_map.items():
            fetch_code_list.append("""
try:
    {0}.value["{1}"] = {2}
    {0}.defined["{1}"] = True
except:
    {0}.defined["{1}"] = False
""".format(self.handlername, key, evaluate))
        fetch_code_list.append(
            "print({}.variables_json)".format(self.handlername))

        return ''.join(fetch_code_list)

    @property
    def variables_dict(self):
        variables = dict()
        variables["_scriptedforms.__version__"] = __version__
        for key in self.variable_evaluate_map:
            if self.defined[key]:
                variables[key] = {
                    "value": self.value[key],
                    "defined": True,
                    "userid": self.userid[key],
                    "timestamp": self.timestamp[key],
                    "signature": self.signature[key]
                }
            else:
                variables[key] = {
                    "defined": False
                }
        return variables

    @property
    def variables_json(self):
        json_string = json.dumps(self.variables_dict, indent=2, sort_keys=True)
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
    converted_paths = [
        os.path.abspath(os.path.expanduser(os.path.expandvars(item)))
        for item in paths
    ]

    for path in converted_paths:
        if not os.path.exists(path):
            raise AssertionError("The path provided does not exist.")

    return converted_paths
