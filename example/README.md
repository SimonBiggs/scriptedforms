# Scripted Forms Package Example

Scipted Forms is designed to be used as a quick and easy GUI for python
packages. Within this directory is an example package that creates a console
script that then uses scriptedforms to boot up a GUI.

## Running the example

To run this example you need to download this repository. One way to do that
is by downloading the [repository zip file](https://github.com/SimonBiggs/scriptedforms/archive/master.zip).

Once you have download and extracted the repository navigate to
this `example` directory and then install this package by running the following within a terminal:

```bash
pip install -e .
```

To then use the package, in any directory on your machine within a terminal run:

```bash
example
```

This will then boot up the scriptedforms GUI in your default browser.

As an extra benefit, if you have either `simple.md` or `detailed.md` open in
the browser while you edit and save the file scriptedforms will automatically
reload.

## A possible method for creating your own package

Firstly you need to change all instances of the package name "example" to your
own package name.

Here is a list of all of these instances within files:

* [`setup.py`](./setup.py) lines [4](./setup.py#L4), [11](./setup.py#L11), and two instances on line [15](./setup.py#L15).
* [`MANIFEST.in`](./MANIFEST.in#L1)
* and [`your_package_name/__init__.py`](./example/__init__.py#L1)

And then the `example` directory needs to be changed to your own package
name as well as `example.py`.

Then you need to create the functions you will be using within your GUI within
`your_package_name.py`. Then within your markdown form file import your
package and create your GUI.

The [`detailed.md`](https://raw.githubusercontent.com/SimonBiggs/scriptedforms/master/example/example/detailed.md)
file hopefully will be helpful as a starting place to build what ever you might
need.

Lastly, on [line 10 of `your_package_name/your_package_name.py`](https://github.com/SimonBiggs/scriptedforms/blob/master/example/example/example.py#L10)
you will need to change the markdown filename to match the filename of your
markdown file.

## A possible method for deploying on a user machine

Lets say you have a really nifty script that does something great. But you want
to make a non-technical frontend for others within your company to interface
with your work. A workflow to get your brilliant tool on a client's machine
might be the following.

First drop your package on a network share.

Then download and install the latest Python3 Anaconda distribution from the
following link on the computer of the user who will need to use your software:

 > <https://www.anaconda.com/download>

On the computer in question within the console navigate to your package on the
shared drive making sure your console's working directory is at the top level
of your package, where `setup.py` is located. Then install your package using
the following command within the console:

```bash
pip install .
```

Or if you want the user's installation to always match what exists on the
network share then use the following:

```bash
pip install -e .
```

Once it is installed create a `.bat` file which simply has within it:

```batch
start your_package_name
```

And then place that on the desktop, or where ever you expect the user will be
clicking on it.
