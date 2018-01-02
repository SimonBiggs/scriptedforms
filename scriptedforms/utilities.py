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

import os
import json
import pprint
import pandas as pd

HERE = os.path.dirname(__file__)

def json_table_to_df(json_table):
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


def print_file(filename):
    with open(filename, 'r') as f:
        contents = f.read()

    print(contents)


def print_apache():
    print_file(os.path.join(HERE, '../Apache-2.0'))


def print_agpl():
    print_file(os.path.join(HERE, '../AGPL-3.0+'))


class VariableHandler(object):
    def __init__(self, variable_evaluate_map):
        self.variable_evaluate_map = json.loads(variable_evaluate_map)
        
        self.timestamp = dict()
        for key in self.variable_evaluate_map:
            self.timestamp[key] = None

        self.user = dict()
        for key in self.variable_evaluate_map:
            self.user[key] = None

        self.signature = dict()
        for key in self.variable_evaluate_map:
            self.signature[key] = None


    @property
    def fetch_code(self):
        fetch_code_list = ["""
print('{"version": "0.1.0"')
"""]
        for key, evaluate in self.variable_evaluate_map.items():
            fetch_code_list.append("""
print(',"{0}":')

try:
    print('{{{{ "defined": true, "value": {{}}, "timestamp": "{2}", "user": "{3}", "signature": "{4}" }}}}'.format({1}))
except:
    print('{{ "defined": false }}')
""".format(key, evaluate, self.timestamp[key], self.user[key], self.signature[key]))

        fetch_code_list.append("""
print('}')""")

        return ''.join(fetch_code_list)


