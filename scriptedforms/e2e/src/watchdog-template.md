<!-- markdownlint-disable MD033 MD041 MD012 -->

<section-start>

```python
from IPython.display import display, Markdown

template_filename = 'watchdog-template.md'
test_filename = 'watchdog-test.md'
manage_filename = 'watchdog-manage.md'

with open(template_filename, 'r') as file:
    template_contents = file.read()
```

</section-start>

<section-start always class='click-me'>

```python
display(Markdown('[{0}]({0})'.format(manage_filename)))
```

</section-start>

<section-button value="Prepend" class="prepend-string-contents">

<variable-string class="write-in-me">to_be_prepended</variable-string>

```python
new_template_contents = to_be_prepended + '\n\n' + template_contents

with open(test_filename, 'w') as file:
    file.write(new_template_contents)
```

</section-button>