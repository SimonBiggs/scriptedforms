<!-- markdownlint-disable MD033 MD041 MD012 -->

<section-start>

```python
import os
from IPython.display import display, Markdown

template_filename = 'watchdog-template.md'
test_filename = 'watchdog-test.md'

with open(template_filename, 'r') as file:
    template_contents = file.read()
```

</section-start>

<section-start always class='click-me'>

```python
display(Markdown('[{0}]({0})'.format(test_filename)))
```

</section-start>

<section-button value="Create" class="create-watchdog-test">

```python
with open(test_filename, 'w') as file:
    file.write(template_contents)
```

</section-button>

<section-button value="Delete" class="delete-watchdog-test">

```python
os.remove(test_filename)
```

</section-button>