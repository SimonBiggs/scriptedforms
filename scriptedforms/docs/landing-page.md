<!-- markdownlint-disable MD033 MD041 MD002 -->

# Live documentation

There isn't any docs here yet.

Watch this space.

## Available example forms

<section-start always>

```python
import urllib.parse
from glob import glob
from IPython.display import display, Markdown
```

</section-start>

<section-filechange onLoad paths="['.']">

```python
filepaths = glob('*.md') + glob('*/*.md') + glob('*/*/*.md')
for filepath in filepaths:
    escaped_filepath = urllib.parse.quote(filepath)
    display(Markdown('[{}](../use/{})'.format(filepath, escaped_filepath)))
```

</section-filechange>