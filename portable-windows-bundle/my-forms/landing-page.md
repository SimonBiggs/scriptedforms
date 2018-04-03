<!-- markdownlint-disable MD033 -->

# Scripted Forms Landing Page

## Edit this form

Open the plain text form file in a new window using the following link:

> [Edit this form](../../edit/landing-page.md)

With this window open, and the edit window open side by side you can see the
effects of changes on the interface.

## My forms

Below is a link to all of the forms within this directory. This list will live
update as you add more forms.

<section-start>

```python
from glob import glob
from IPython.display import display, Markdown
```

</section-start>

<section-filechange onLoad paths="['.']">

```python
filepaths = glob('*.md') + glob('*/*.md') + glob('*/*/*.md')
for filepath in filepaths:
  display(Markdown('[./{0}]({0})'.format(filepath)))
```

</section-filechange>