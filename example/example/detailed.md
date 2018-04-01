<!-- markdownlint-disable MD033 -->

# A Demo Form

## Description

This is a detailed example demonstrating the usage of scriptedforms.

This file format is based upon markdown. There are however a few
extra custom html elements. The custom html elements come in two
types, either section elements `<section-something>` or
variable elements `<variable-something>`.

## Custom elements overview

### Sections overview

#### Running Python code

Whenever python fenced code blocks are written within a section that code is
no longer displayed within the document, instead it is sent to the Python
kernel when certain conditions are fulfilled and inplace of where the code was
written the output of that code is displayed. Code output is displayed as it
would display within a Jupyter Notebook.

Python fenced code is written as follows:

```python
print('Hello World!')
```

#### Section types

There are four kinds of sections

* `<section-start>`,
* `<section-live>`,
* `<section-button>`,
* and `<section-output>`.

Code which is written inside of these defined sections is run
as python code according to specific rules.

### Variable overview

Variable elements are attached to a specific python variable which update on
user input. All variable elements take just one item placed between the
open and close braces. That item is
the Python variable definition. It doesn't strictly have to be a Python variable
it merely has to be valid Python code to exist on the left hand side of an assignment
equal sign.

There are six kinds of variable inputs:

* `<variable-number>`,
* `<variable-slider>`,
* `<variable-table>`,
* `<variable-tick>`,
* `<variable-toggle>`,
* `<variable-string>`,
* and `<variable-dropdown>`.

`<variable-number>` and `<variable-slider>` represent floats or integers.
`<variable-string>` represents a Python string. `<variable-tick>` and `<variable-toggle>`
are both booleans. The `<variable-table>` is a pandas dataframe with all of the values
in the dataframe being floats or integers. `<variable-dropdown>` is a string with provided options.

## Usage of the scriptedforms elements

### Start sections

Whenever a jupyterlab services session is started
code within the start sections is run first.

If you reopen or update the form template without restarting the kernel
this code will not re-run however a button will appear that will allow you to
manually re-run the code if need be.

An example `<section-start>` is given following:

<section-start>

```python
import time
from IPython.display import display, Markdown

plt.rc('font', size=15)

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

custom_machine = ''

display(Markdown('This is the output of a start section'))
```

</section-start>

As can be seen from this code there are already a few namespaces included by
default within the Python session. Some of these are for convenience, some are
required for the proper running of the form. The code that is run at boot of
a new form kernel can be found within the
[source code](https://github.com/SimonBiggs/scriptedforms/blob/master/scriptedforms/src/services/session-start-code.ts).

### Live sections and demo of each of the variable types

The `<section-live>` element is designed to contain both code and variable inputs. Whenever
the user changes any variable within the live section all code that is also
contained within that live section is subsequently run.

Each of the usable variables are demoed below making use of `<section-live>`.

#### Number and slider variables

Below is a `<section-live>` containing both `<variable-number>` and
`<variable-slider>` elements. They are using a numpy array that has previously
been defined within the `<section-start>`.

<section-live>
<variable-number>data[0]</variable-number>
<variable-number>data[1]</variable-number>

<variable-slider>data[0]</variable-slider>
<variable-slider>data[1]</variable-slider>

```python
plt.figure(figsize=(5*1.618,5))
plt.plot(data, 'o');
```

`<variable-number>` and `<variable-slider>` both have four optional parameters:

* `label`, for changing the visible label of the input
* `min` and `max`, changing the range of the input
* `step` for changing the step size of the input

Min and max defaults to `null` for `<variable-number>` and defaults to 0 and 100
respectively for `<variable-slider>`. Step defaults to 1 for both elements.

The use of these optional parameters is demoed below:

<variable-number label="A custom label" min="0" max="10" step="0.1">data[2]</variable-number>
<variable-slider label="A custom label" min="0" max="10" step="0.1">data[2]</variable-slider>

</section-live>

#### Example slider use case

Using the slider and live sections combined with matplotlib plots you can
produce utilities like the following:

<section-start>

```python
t = np.linspace(-2*np.pi, 2*np.pi, 500)
omega = np.ones(2)
```

</section-start>

<section-live>

Angular frequencies ($\omega$):

<variable-slider label="$\omega [0]$" min="0" max="6" step="0.1">omega[0]</variable-slider>
<variable-slider label="$\omega [1]$" min="0" max="6" step="0.1">omega[1]</variable-slider>

```python
plt.figure(figsize=(5*1.618,5))

oscillation = np.sin(t[:, np.newaxis] * omega[np.newaxis, :])
summation = np.sum(oscillation, axis=1)

plt.plot(t, oscillation)
plt.plot(t, summation)

plt.xlim([-2*np.pi, 2*np.pi])
plt.ylim([-2.8, 2.8])
plt.title('Two sin curves and their summation')
plt.legend([
    r'$\omega [0] = {0:0.1f}$'.format(omega[0]),
    r'$\omega [1] = {0:0.1f}$'.format(omega[1]),
    'Summation'], loc='upper right')
plt.xlabel('time (seconds)')
plt.ylabel(r'$sin(\omega \times t)$');
```

</section-live>

#### Table variables

Table variables display a full pandas dataframe. The live code can update one
part of the table as other parts are being edited.

<section-live>
<variable-table inputTypes="{'Meas1': 'number', 'Meas2': 'number', 'Meas3': 'number', 'Avg': 'readonly'}">table</variable-table>

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
    display(Markdown('Hello World!'))
```

<variable-toggle>bye</variable-toggle>
</section-live>

#### String variables

String variables fill the entire width of the container they are in. They also
expand when new lines are provied. An example use case is an optional notes
field.

The Python code for this notes field takes what is written and renders it as
markdown. Try writing `## Hello World!` and see what happens.

<section-live>
<variable-string placeholder="write some notes here">notes</variable-string>

```python
display(Markdown(notes))
```

</section-live>

#### Dropdown variables

Dropdown allows options to be available in a dropdown list. To define the items
used within the dropdown a Python list needs to be provided to the `items` html
parameter. See below for how this works in practice.

<variable-string label="Your own machine name" placeholder="Write a custom machine name here">
  custom_machine
</variable-string>

<section-live>

<variable-dropdown items="[1234, 2345, 'George', custom_machine]">machine</variable-dropdown>

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

```python
display(Markdown(notes))
```

</section-button>

They will not run until their respective button is pressed.

#### Button customistion

Button sections are customisable, their content can be changed to words by
changing the value property.

<section-button value="Submit">

```python
submit_count += 1
display(Markdown('Submitted {} times!'.format(submit_count)))
```

</section-button>

Buttons can also be disabled using the conditional property. An example is the
following button which is only enabled once the submit count becomes at least
10.

<section-button inline value="Super Submit" conditional="submit_count >= 10">

```python
display(Markdown('## Super Submit!!'))
```

</section-button>

<section-button value="Slow button">

```python
time.sleep(1)
```

</section-button>

### Output sections

Code placed within output groups will run after any variable on the form
changes in value.

<section-output>

```python
output_count += 1
print(output_count)

print(_scriptedforms_variable_handler.variables_json)
```

</section-output>