// jupyterlab-form
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// the GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination.

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the Apache-2.0 and the AGPL-3.0+ for the specific language governing 
// permissions and limitations under the Apache-2.0 and the AGPL-3.0+.

/*
A default markdown form.
*/

export const defaultFormContents = `# A Demo Form

## Description

This is an example form for use as a template or demonstrating
form creation.

This file format is based upon markdown. There are however a few
extra elements which are explained below.

## Sections and variable inputs

There are four kinds of sections:

 * \`start\`,
 * \`live\`,
 * \`button\`,
 * and \`output\`.

Code which is written inside of these defined sections is run
as python code according to specific rules.

Within the form variable inputs can be included.
There are six kinds of variable inputs:

 * \`number\`,
 * \`slider\`,
 * \`table\`,
 * \`tick\`,
 * \`toggle\`,
 * and \`string\`.

These are attached to a specific python variable which update on
user input. Number and slider represent floats. String represents a Python
string. Tick and toggle are both booleans. The table variable is a pandas 
dataframe with all of the values in the dataframe being floats.

### Start sections

A \`start\` section is defined as following:

[start]
\`\`\`
data = np.ones(3) * np.nan
data[0] = 5

table = pd.DataFrame(
  columns=['Meas1', 'Meas2', 'Meas3', 'Avg'],
  index=['6MV', '10MV'],
  data=[[1,np.nan,np.nan,np.nan],[4,5,np.nan,np.nan]])

hello = False
world = False
bye = False
\`\`\`
[/start]

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

Each of the usable variables are demoed below making use of \`live\` sections.
A live section is designed to contain both code and variable inputs. Whenever
the user changes any variable within the live section all code within
that live section is subsequently run.

#### Number and slider variables

Here is a \`live\` section containing both number and slider that produces a 
plot.

[live]
[number]data[0][/number]
[number]data[1][/number]
[number]data[2][/number]

[slider]0,100,1,data[0][/slider]
[slider]-100,100,20,data[1][/slider]
[slider]0,1,0.01,data[2][/slider]
\`plt.plot(data, 'o');\`
[/live]

The slider requires four inputs, the minimum, maximum, step size, and finally 
the name of the python variable which is mapped to the slider.

All other variable types apart from the slider only require one input, the
python variable name.

#### Table variables

Table variables display a full pandas dataframe. The live code can update one
part of the table as other parts are being edited.

[live]
[table]table[/table]
\`\`\`
table.iloc[:,3] = np.nanmean(table.iloc[:,0:3], axis=1)
\`\`\`
[/live]

#### The tick and toggle variables

Tick and toggle variables are simply different representations of a True/False
boolean variable within python. They are provided for use cases such as check
lists and pass fail tests. These variables can interact with each other in 
interesting ways via the live Python code.

[live]
[tick]hello[/tick]

[tick]world[/tick]
\`\`\`
if bye:
    hello = False
    world = False

if hello and world:
    print('Hello World!')
\`\`\`

[toggle]bye[/toggle]
[/live]

#### String variables

String variables fill the entire width of the container they are in. They also
expand when new lines are provied. An example use case is an optional notes
field.

[live]
[string]notes[/string]
\`print(notes)\`
[/live]

### Button sections

Button groups are designed for long running or standalone tasks that
should not run whenever a user changes a variable.

They are defined as following:

[string]notes[/string]

[button]
\`print(notes)\`
[/button]

They will not run until their respective button is pressed.

### Output groups

Code placed within output groups will run after the code blocks within start, 
live or button sections are run.

Any variable placed within an output group will format as a non-editable card.
By placing key output variables within an output group their results will be
saved in a format that is easy to extract and trend.


## Future work

It is the aim to have it so that the results of these forms can be
saved in \`[formname]-[timestamp].results.json\` files.
Whenever a set of results are saved a copy of the template is included within
the json.

All variable inputs will be recorded along with the timestamp representing the
time at which that input was last changed.

Once this form extension is in a usable state the benefits will truly come to 
light once a second extension is made  which takes the data and trends the 
results over time.

Another extension of value would be a scheduling and overview extension
which defines a set of tasks. Each task can contain multiple forms.
There would also be targets, tasks can be assigned to multiple targets
and assigned tasks can be schuduled to be completed over defined intervals.
This would present an overview of all targets, their corresponding tasks,
when the scheduled tasks were last completed, when they are next due by.
`
