<!-- markdownlint-disable MD033 MD041 -->

# A template with no nested code

All code on this form is stored within a python file.

<section-start always code="from importlib import reload; import data; import functions;"></section-start>

## Python files reload when changed

By using `<section-filechange>` any changes to the python files can be
automatically updated.

<section-filechange paths="['./data.py']" code="reload(data);"></section-filechange>
<section-filechange paths="['./functions.py']" code="reload(functions);"></section-filechange>

## Varible data is loaded from within the code python file

The variable `table` is defined within `data.py`, but it is able to be used
here.

<variable-table inputTypes="data.input_types">data.table</variable-table>
<section-button value="Increment" code="functions.increment(data.table)"></section-button>

## Cleaner easier to understand templates

By using inline code within the sections the templates are more focused on
what is visible on the screen. All programming logic can be delegated to the
Python file.

Conveniently this also plays nicer with linters.

## Debug

This is displaying all of the variable values for debugging purposes.

<section-output code="print(_scriptedforms_variable_handler.variables_json)"></section-output>