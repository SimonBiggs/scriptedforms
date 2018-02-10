<!-- markdownlint-disable MD033 -->

# Scripted Forms

Quickly and easily create a powerful reactive form frontend for a python
package using markdown.

## Quick start

If you would like to quickly take scriptedforms for a spin first install it:

```bash
pip install scriptedforms
```

Then copy the following into a python prompt:

```python
import scriptedforms as sf

def create_file(filename):
    markdown_contents = """
# An example

<section-live>

<variable-string>your_name</variable-string>

`print('Hello {}!'.format(your_name))`

</section-live>"""
    with open(filename, 'w') as f:
        f.write(markdown_contents)

filename = 'example.md'
create_file(filename)
sf.load(filename)
```

Note that because scriptedforms relies on the jupyter notebook server
the above code cannot be run within a jupyter app itself. For example, that means that you cannot
use an `ipython` prompt or a jupyter notebook to run the above code.

After running the above code, if everything worked, you should be able to type
your name into the form and see the code field live update with each key stroke:

<p align="center">
  <img src="./screenshots/quick-start.png">
</p>

## More detailed markdown file

For a markdown file that presents all of the features of scriptedforms see
[complicated.md](https://raw.githubusercontent.com/SimonBiggs/scriptedforms/master/example/example/complicated.md).
A section of that form is shown below as a screenshot:

<p align="center">
  <img src="./screenshots/complicated.png">
</p>

## Example that can be used as a template for deployment

This is designed to be used as a quick and easy GUI for python packages. An
example package that creates a console script that then uses scriptedforms to
boot up a GUI can be found within the [example](./example) directory.

Within the [`README.md`](./example) file of that directory there is an
explanation of how you might go about deploying your utility with its new GUI.

## Installing scriptedforms from the GitHub source

The majority of users will not need to pay attention to this section.

For those who wish to build scriptedforms from the source provided within this repository, instead of using pypi, the javascript bundle will need to be built.
To do this you will need to [install `yarn`](https://yarnpkg.com/lang/en/docs/install/) and then run the following in the [directory containing the `package.json` file](./scriptedforms):

```bash
yarn
yarn build
```

After that you will be able to install the scriptedforms package from the GitHub source.

## Software license agreement

Copyright (C) 2018 Simon Biggs

This software is licensed under both the Apache License, Version 2.0
(the "Apache-2.0") and the
GNU Affrero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version (the "AGPL-3.0+").

You may not use this software except in compliance with both the Apache-2.0 and
the AGPL-3.0+.

Copies of these licenses can be found at:

* AGPL-3.0+ -- <https://www.gnu.org/licenses/agpl-3.0.txt>
* Apache-2.0 -- <https://www.apache.org/licenses/LICENSE-2.0.html>

Unless required by applicable law or agreed to in writing, software
distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an **"AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND**, either express or implied. See
the Apache-2.0 and the AGPL-3.0+ for the specific language governing permissions and
limitations under the Apache-2.0 and the AGPL-3.0+.

### Justification for licensing under both at the same time in combination

Within Australian courts if there is any ambiguity in liability exclusion
clauses they will be interpreted narrowly. If liability for negligence is not
expressly excluded it may not be read as excluded within an Australian court
(<https://eprints.qut.edu.au/7404/1/open_source_book.pdf> page 80).
The same is true for clauses which seek to exclude liability for consequential
loss.

The AGPL-3.0+ does not explicitly mention negligence anywhere within its
license text. The Apache-2.0 does. In order to maintain familiarity within the
software community, and to maintain compatibility with other licenses instead
of appending these limitation of liability clauses to the AGPL-3.0+, instead,
the Apache-2.0 was included as well.
