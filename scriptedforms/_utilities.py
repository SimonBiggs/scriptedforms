# scriptedforms
# Copyright (C) 2017 Simon Biggs

# Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
# GNU Affrero General Public License as published by the Free Software 
# Foundation, either version 3 of the License, or (at your option) any later 
# version (the "AGPL-3.0+").

# You may not use this file except in compliance with both the Apache-2.0 AND 
# the AGPL-3.0+ in combination (the "Combined Licenses").

# You may obtain a copy of the AGPL-3.0+ at

#     https://www.gnu.org/licenses/agpl-3.0.txt

# You may obtain a copy of the Apache-2.0 at 

#     https://www.apache.org/licenses/LICENSE-2.0.html

# Unless required by applicable law or agreed to in writing, software
# distributed under the Combined Licenses is distributed on an "AS IS" BASIS, 
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See 
# the Combined Licenses for the specific language governing permissions and 
# limitations under the Combined Licenses.

import sys
import os
import json
import pandas as pd

from ._version import __version__


def _json_table_to_df(json_table):
    table = json.loads(json_table)
    columns = [t['name'] for t in table['schema']['fields']]
    index = table['schema']['primaryKey'][0]

    df = pd.DataFrame(
        table['data'],
        columns=columns)

    df.set_index(index, inplace=True)

    for column in columns:
        if column != index:
            df[column] = df[column].astype('float64')

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
        fetch_code_list.append("print({}.variables_json)".format(self.handlername))

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
        json_string = json_string.replace('NaN', 'null').replace('-Infinity', 'null').replace('Infinity', 'null')
        return json_string
