LICENCE_HEADER = """
                ================================
                         ScriptedForms
                 Copyright (C) 2018 Simon Biggs
                ================================

 This software is licensed under both the Apache License, Version 2.0
 (the "Apache-2.0") and the GNU Affrero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version (the "AGPL-3.0+").

 You may not use this software except in compliance with both the
 Apache-2.0 and the AGPL-3.0+.

 Copies of these licenses can be found at:
  * AGPL-3.0+ -- https://www.gnu.org/licenses/agpl-3.0.txt
  * Apache-2.0 -- https://www.apache.org/licenses/LICENSE-2.0.html

 Unless required by applicable law or agreed to in writing, software
 distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on
 an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the Apache-2.0 and the AGPL-3.0+ for
 the specific language governing permissions and limitations under the
 Apache-2.0 and the AGPL-3.0+.
"""

import os
import sys
import json
from glob import glob
import shutil

from ipython_genutils.path import ensure_dir_exists
from jupyter_core.paths import jupyter_data_dir


SCRIPTEDFORMS_CONFIG_DIRECTORY = os.path.join(
    os.path.split(jupyter_data_dir())[0], 'scriptedforms')

USER_CONFIG_FILE = os.path.join(SCRIPTEDFORMS_CONFIG_DIRECTORY, 'configuration.json')

MODULE = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))

def get_scriptedforms_directory_config():
    with open(USER_CONFIG_FILE, 'r') as config_file:
        configuration = json.load(config_file)
    
    return configuration['scriptedforms_directory']


def initialise_scriptedforms_directory():
    print(LICENCE_HEADER)
    agree = input(
        'Do you agree? [Y/n]\n')
    if agree != '' and agree.lower() != 'y':
        sys.exit('Abort.')

    default_directory = os.path.join(os.getcwd(), 'scriptedforms')
    
    directory = input(
        'Define your Scripted Forms directory.\n  [{}]\n'
        ''.format(default_directory))
    
    if directory == '':
        directory = default_directory

    files_to_copy_glob = [
        '*.md', 'start_scripted_forms.bat', 'users/*', 'templates/*',
        'results/*', 'AGPL-3.0+', 'Apache-2.0']
    module_files_to_copy = [
        item for search in files_to_copy_glob for item in glob(os.path.join(MODULE, search))]

    proposed_files_to_copy = [
        os.path.relpath(filename, MODULE) for filename in module_files_to_copy]       

    already_exists = []
    for filepath in proposed_files_to_copy:
        new_filepath = os.path.join(directory, filepath)
        if os.path.exists(new_filepath):
            already_exists.append(new_filepath)

    overwrite_files = True
    if already_exists:
        print('The following files already exist:')
        for filepath in already_exists:
            print(filepath)
        
        overwrite = input(
            'Do you wish to overwrite these files? [y/N]\n')
        if overwrite.lower() != 'y':
            overwrite_files = False

    files_to_copy = set(proposed_files_to_copy)
    if not overwrite_files:
        files_to_copy = files_to_copy.difference(set(already_exists))

    with open(USER_CONFIG_FILE, 'w') as config_file:
        json.dump({'scriptedforms_directory': directory}, config_file)

    for filename in files_to_copy:
        src = os.path.join(MODULE, filename)
        dst = os.path.join(directory, filename)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(src, dst)

    return directory

    
def get_scriptedforms_directory():
    ensure_dir_exists(SCRIPTEDFORMS_CONFIG_DIRECTORY, mode=0o700)

    try:
        scriptedforms_directory = get_scriptedforms_directory_config()
    except FileNotFoundError:
        scriptedforms_directory = initialise_scriptedforms_directory()

    return scriptedforms_directory
