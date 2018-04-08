import os
import json

try:
    HERE = os.path.dirname(__file__)
except NameError:
    HERE = 'scriptedforms'

with open(os.path.join(HERE, 'package.json')) as file:
    data = json.load(file)

version_info = data['version'].replace('.', ' ').replace('-', ' ').split(' ')
__version__ = '.'.join(map(str, version_info[:3])) + ''.join(version_info[3:])
