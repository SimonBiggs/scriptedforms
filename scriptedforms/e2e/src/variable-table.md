<!-- markdownlint-disable MD033 MD041 -->

# Variable table

<section-start always code="from importlib import reload; variable_table = __import__('variable-table');"></section-start>
<section-filechange paths="['./variable-table.py']" code="reload(variable_table);"></section-filechange>
<section-filechange onLoad paths="['./variable-table.csv']" code="variable_table.load_table();"></section-filechange>

## Default table

<variable-table class="default">variable_table.table</variable-table>

## Editable pandas json types

<variable-table class="type-edit" typeEdit>variable_table.table</variable-table>

## Each input type

<variable-table class="input-types-1" inputTypes="variable_table.input_types_1" dropdownItems="variable_table.dropdown_items">variable_table.table</variable-table>

<variable-table class="input-types-1" inputTypes="variable_table.input_types_2" dropdownItems="variable_table.dropdown_items">variable_table.table</variable-table>

## Dropdown input types with no dropdown items defined

<variable-table class="undefined-dropdown-items" inputTypes="variable_table.input_types_1">variable_table.table</variable-table>

## Nonsense parameter values

<variable-table class="nonsense-parameters" inputTypes="None" dropdownItems="None">variable_table.table</variable-table>

## Standalone Table

<variable-table inputTypes="variable_table.input_types_1" dropdownItems="variable_table.dropdown_items">variable_table.table_other</variable-table>