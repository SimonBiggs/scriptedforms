export const FORMCONTENTS = `[import]

\`\`\`python
import time
import numpy as np
import matplotlib.pyplot as plt
%matplotlib inline

data = np.ones(3) * np.nan
data[0] = 5

power = 1
\`\`\`

[/import]

# Write a title here

Edit the text box on the left.
Press "Ctrl + Enter" to update the preview.

Live will run and re-run whenever one of the input boxes is changed.

[live]

\`result = np.nanmean(data)\`

[number]data[0][/number]
[number]data[1][/number]
[number]data[2][/number]
\`print("Average = {0:.4f}".format(result))\`

[/live]

[live]

Power Value: [number]power[/number]

\`\`\`python
x = np.linspace(-10, 10)
y = x ** power
plt.plot(x, y);
\`\`\`

[/live]


[live]
[string]a_string[/string]

\`\`\`python
print(a_string)
\`\`\`

[/live]


Button groups will not run initially, they will only run when their respective
button is pressed.

[button]

\`\`\`python
np.linspace(0, 1, 5)
\`\`\`

[/button]

More text

 * A list
 * More
 * Third

Weird

Need to think of a way to allow intermittent prints to display... Need to be
able to pass the future to the code component while still have the queue wait
till the code is complete.

[button]

\`\`\`python
print("Start Sleep")
time.sleep(10)
print("Finish Sleep")
\`\`\`

[/button]

Test

[button]

\`\`\`python
an_error
\`\`\`

[/button]


Make a button permanently down here that when clicked it force kills the
server. This should make the queue now finish quite quickly. The item of
starting back up the kernel should still be placed on the queue, but it should
resest quite quickly. After the reset all code from top to bottom is to be run.
`
