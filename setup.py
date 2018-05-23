import os
from glob import glob
from setuptools import setup

here = os.path.dirname(os.path.abspath(__file__))
name = 'scriptedforms'
pjoin = os.path.join
tar_path = pjoin(here, 'scriptedforms', '*.tgz')

version_ns = {}
with open(pjoin(here, name, '_version.py')) as file:
    code = file.read()
    exec(code, version_ns)

version = version_ns['__version__']


def get_data_files():
    """Get the data files for the package.
    """
    return [
        ('share/jupyter/lab/extensions', [
            os.path.relpath(f, '.') for f in glob(tar_path)
        ]),
        ('etc/jupyter/jupyter_notebook_config.d', [
            os.path.relpath(
                pjoin(here, 'scriptedforms', 'scriptedforms.json'), '.')
        ])
    ]


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
    data_files=get_data_files(),
    license='AGPL-3.0+',
    python_requires='>=3.5',
    install_requires=[
        'notebook >= 5.5',
        'numpy',
        'pandas',
        'watchdog',
        'matplotlib',
        'jupyterlab >= 0.32.0'
    ],
    classifiers=[],
    url="http://scriptedforms.com.au",
    include_package_data=True
)
