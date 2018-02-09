<!-- Scripted Forms

Copyright (C) 2018 Simon Biggs

This software is licensed under both the Apache License, Version 2.0
(the "Apache-2.0") and the
GNU Affrero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version (the "AGPL-3.0+").

You may not use this file except in compliance with both the Apache-2.0 and
the AGPL-3.0+.

Copies of these licenses can be found at:

* AGPL-3.0+ -- https://www.gnu.org/licenses/agpl-3.0.txt
* Apache-2.0 -- https://www.apache.org/licenses/LICENSE-2.0.html

Unless required by applicable law or agreed to in writing, software
distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an **"AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND**, either express or implied. See
the Apache-2.0 and the AGPL-3.0+ for the specific language governing permissions and
limitations under the Apache-2.0 and the AGPL-3.0+. -->

<!-- markdownlint-disable MD033 -->

# A Demo Form

## Description

This is an example form for use as a template or demonstrating
form creation.

This file format is based upon markdown. There are however a few
extra elements which are explained below.

## Sections and variable inputs

There are four kinds of sections:

* `start`,
* `live`,
* `button`,
* and `output`.

Code which is written inside of these defined sections is run
as python code according to specific rules.

Within the form variable inputs can be included.
There are six kinds of variable inputs:

* `number`,
* `slider`,
* `table`,
* `tick`,
* `toggle`,
* `string`,
* and `dropdown`.

These are attached to a specific python variable which update on
user input. Number and slider represent floats. String represents a Python
string. Tick and toggle are both booleans. The table variable is a pandas
dataframe with all of the values in the dataframe being floats.

### Start sections

A `start` section is defined as following:

<section-start>

```python
data = np.ones(3) * np.nan
data[0] = 5

table = pd.DataFrame(
  columns=['Meas1', 'Meas2', 'Meas3', 'Avg'],
  index=['6MV', '10MV'],
  data=[[1,np.nan,np.nan,np.nan],[4,5,np.nan,np.nan]])

hello = False
world = False
bye = False

machine = None

submit_count = 0
output_count = 0
```

</section-start>

Whenever a jupyterlab services session is started
code within the start sections is run first.

If you reopen or update the form template without restarting the kernel
this code will not re-run however a button will appear that will allow you to
manually re-run the code if need be.

As can be seen from this code there are already a few namespaces included by
default within the Python session. Some of these are for convenience, some are
required for the proper running of the form. The code that is run at boot of
a new form kernel can be found within the
[source code](https://github.com/SimonBiggs/jupyterlab-form/blob/master/src/angular-app/services/session-start-code.ts).

### Live sections and demo of each of the variable types

Each of the usable variables are demoed below making use of `live` sections.
A live section is designed to contain both code and variable inputs. Whenever
the user changes any variable within the live section all code within
that live section is subsequently run.

#### Number and slider variables

Here is a `live` section containing both number and slider that produces a
plot.

<section-live>
<variable-number>data[0]</variable-number>
<variable-number>data[1], -100, 100</variable-number>
<variable-number>data[2], 0, 10, 0.1</variable-number>

<variable-slider>data[0]</variable-slider>
<variable-slider>
  data[1],
  -100,
  100
</variable-slider>
<variable-slider>
  data[2],
  0,
  10,
  0.1
</variable-slider>
`plt.plot(data, 'o');`
</section-live>

Both the number and the slider require at least one input, the python variable
name. They both have three remaining optional inputs, minimum, maximum, and
step size in that order. The inputs need to be separated by commas. White space
is ignored.

Should optional inputs not be given they are assigned the default values. In
both the slider and number variables step size defaults to 1. In the number
variable minimum and maximum defaults to not being set. On the slider the
minimum defaults to 0, the maximum to 100.

#### Table variables

Table variables display a full pandas dataframe. The live code can update one
part of the table as other parts are being edited.

<section-live>
<variable-table>table</variable-table>

```python
table.iloc[:,3] = np.nanmean(table.iloc[:,0:3], axis=1)
```

</section-live>

#### The tick and toggle variables

Tick and toggle variables are simply different representations of a True/False
boolean variable within python. They are provided for use cases such as check
lists and pass fail tests. These variables can interact with each other in
interesting ways via the live Python code.

<section-live>
<variable-tick>hello</variable-tick>

<variable-tick>world</variable-tick>

```python
if bye:
    hello = False
    world = False

if hello and world:
    print('Hello World!')
```

<variable-toggle>bye</variable-toggle>
</section-live>

#### String variables

String variables fill the entire width of the container they are in. They also
expand when new lines are provied. An example use case is an optional notes
field.

<section-live>
<variable-string>notes</variable-string>
`print(notes)`
</section-live>

#### Dropdown variables

Dropdown allow predifined options to be available in a dropdown list. When
defining a dropdown variable the first input is the python variable name. All
remaining inputs are give the options for the dropdown. All options must be
separated by commas. Surrounding whitespace is ignored.

<section-live>
<variable-dropdown>machine,
  1234,
  2345,
  George
</variable-dropdown>

```python
print(machine)
```

</section-live>

### Button sections

Button groups are designed for long running or standalone tasks that
should not run whenever a user changes a variable.

They are defined as following:

<variable-string>notes</variable-string>

<section-button>
`print(notes)`
</section-button>

They will not run until their respective button is pressed.

#### Button customistion

Button sections are customisable, their content can be changed to words by
changing the name property.

<section-button name="Submit">

```python
submit_count += 1
print('Submitted {} times!'.format(submit_count))
```

</section-button>

Buttons can also be disabled using the conditional property. An example is the
following button which is only enabled once the submit count becomes at least
10.

<section-button name="Super Submit" conditional="submit_count >= 10">

```python
print('SUPER SUBMIT!!!')
```

</section-button>

### Output sections

Code placed within output groups will run after any variable on the form
changes in value.

[Output sections are no longer running]
<section-output>

```python
output_count += 1
print(output_count)

print(_scriptedforms_variable_handler.variables_json)
```

</section-output>

[Not yet implemented] Any variable placed within an output group will format as a non-editable card.
