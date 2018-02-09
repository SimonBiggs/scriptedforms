from setuptools import setup

setup(
    name="example",
    version="0.1.0",
    author="Your Name",
    author_email="Your Email",
    description="Your short description",
    long_description="Your long description",
    packages=[
        "example"
    ],
    entry_points={
        'console_scripts': [
            'example=example:main',
        ],
    },
    license='AGPL-3.0+ AND Apache-2.0',
    install_requires=[
        'scriptedforms'
    ],
    include_package_data=True
)
