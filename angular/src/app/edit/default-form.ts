export const FORMCONTENTS = `<import>

    import time
    import numpy as np
    import matplotlib.pyplot as plt
    %matplotlib inline

    a = 5
    b = np.nan
    c = np.nan

    power = 1

</import>

# Write a title here

Edit the text box on the left.
Press "Ctrl + Enter" to update the preview.

Live will run and re-run whenever one of the input boxes is changed.

<live>

\`result = np.nanmean([a, b, c])\`

<variable type="number">a</variable>
<variable type="number">b</variable>
<variable type="number">c</variable>
\`print("Average = " + str(result))\`

</live>

<live>

Power Value: <variable type="number">power</variable>

    x = np.linspace(-10, 10)
    y = x ** power
    plt.plot(x, y);

</live>

Wait groups will not run initially, they will only run when their respective
button is pressed.

<wait>

    np.linspace(0, 1, 5)

</wait>

More text

 * A list
 * More
 * Third

Weird

Need to think of a way to allow intermittent prints to display... Need to be
able to pass the future to the code component while still have the queue wait
till the code is complete.

<wait>

    print("Start Sleep")
    time.sleep(10)
    print("Finish Sleep")

</wait>

Test

<wait>

    an_error

</wait>


Make a button permanently down here that when clicked it force kills the
server. This should make the queue now finish quite quickly. The item of
starting back up the kernel should still be placed on the queue, but it should
resest quite quickly. After the reset all code from top to bottom is to be run.
`
