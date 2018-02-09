import scriptedforms as sf

filename = 'example.md'

markdown_contents = """
# An example

<section-live>

<variable-string>your_name</variable-string>

```python
print('Hello {}!'.format(name))
```

</section-live>
"""

with open(filename, 'w') as file:
    file.write(markdown_contents)
    
sf.load(filename)