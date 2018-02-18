<!-- markdownlint-disable MD033 MD041 MD012 -->

<section-start>

```python
from IPython.display import display, Markdown
```

</section-start>

<section-start always>

```python
button_enabled = False
```

</section-start>


<section-button class="check-my-running">

```python
display(Markdown('# Hello'))
```

</section-button>


<section-button name="foo" class="check-my-name"></section-button>

<section-button name="Disable" class="make-false">

```python
button_enabled = False
```

</section-button>


<section-button name="Enable" class="make-true">

```python
button_enabled = True
```

</section-button>

<section-button conditional="button_enabled" class="check-my-conditional"></section-button>