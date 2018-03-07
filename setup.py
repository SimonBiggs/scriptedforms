import os
from setuptools import setup

repo_root = os.path.dirname(os.path.abspath(__file__))
name = 'scriptedforms'
pjoin = os.path.join

version_ns = {}
with open(pjoin(repo_root, name, '_version.py')) as file:
    code = file.read()
    exec(code, version_ns)

version = version_ns['__version__']


setup(
    name="scriptedforms",
    version=version,
    author="Simon Biggs",
    author_email="sbiggs@scriptedforms.com.au",
    description="ScriptedForms.",
    long_description=(
        ""
    ),
    keywords=[],
    packages=[
        "scriptedforms"
    ],
    entry_points={
        'console_scripts': [
            'scriptedforms=scriptedforms:main',
        ],
    },
    license='AGPL-3.0+',
    python_requires='>=3.5',
    install_requires=[
        'notebook >= 5.3',
        'numpy',
        'pandas',
        'watchdog',
        'matplotlib'
    ],
    extras_require={
        'test': ['jupyterlab'],
    },
    classifiers=[],
    url="http://scriptedforms.com.au",
    include_package_data=True
)
