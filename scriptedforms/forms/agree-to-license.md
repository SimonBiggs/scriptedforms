<!-- markdownlint-disable MD033 MD041 -->

# Need to agree to Scripted Forms software license on first use

This appears to be the first use of the Scripted Forms package on this
computer. Please agree to the terms and conditions below before you can
continue to use Scripted Forms.

<style>
.centre-output pre {
  width: 620px;
  margin: auto;
}

.no-word-break code {
  word-break: keep-all;
}

mat-card-content {
  height: 512px;
  overflow-y: auto;
}
</style>

<section-start>

```python
import os
from ipython_genutils.path import ensure_dir_exists
from jupyter_core.paths import jupyter_data_dir

from IPython.display import display, Markdown
from scriptedforms._utilities import _print_agpl, _print_apache

scripted_forms_data_directory = os.path.join(
    os.path.split(jupyter_data_dir())[0], 'scriptedforms')
ensure_dir_exists(scripted_forms_data_directory)

license_agreement_file = os.path.join(
  scripted_forms_data_directory,
  'has-agreed-to-scriptedforms-license')

i_agree_to_agpl = False
i_agree_to_addional_terms = False
```

</section-start>

## Software license agreement

Scripted Forms -- Making GUIs easy for everyone on your team.

Copyright (C) 2017 Simon Biggs

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version (the "AGPL-3.0+").

This program is distributed in the hope that it will be useful,
but **WITHOUT ANY WARRANTY**; without even the implied warranty of
**MERCHANTABILITY** or **FITNESS FOR A PARTICULAR PURPOSE**. See the
GNU Affero General Public License and the additional terms for more
details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see:

> <http://www.gnu.org/licenses/>.

ADDITIONAL TERMS are also included as allowed by Section 7 of the GNU
Affrero General Public License. These aditional terms are Sections 1, 5,
6, 7, 8, and 9 from the Apache License, Version 2.0 (the "Apache-2.0")
where all references to the definition "License" are instead defined to
mean the AGPL-3.0+.

You should have received a copy of the Apache-2.0 along with this
program. If not, see:

> <http://www.apache.org/licenses/LICENSE-2.0>.

<br>

<mat-card class="mat-elevation-z8">
  <mat-card-header>
    <mat-card-title>AGPL-3.0+</mat-card-title>
    <mat-card-subtitle>The GNU Affrero General Public License version 3.0+</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content class="mat-elevation-z1">
<section-start class="centre-output" always>

```python
_print_agpl()
```

</section-start>
  </mat-card-content>
  <mat-card-actions align="right">
  <variable-tick name="I agree to the terms and conditions of the AGPL-3.0+" required>
    i_agree_to_agpl
  </variable-tick>
  </mat-card-actions>
</mat-card>

<br>

<mat-card class="mat-elevation-z8">
  <mat-card-header>
    <mat-card-title>Additional Terms &ndash; The Apache-2.0 License Sections 1, 5, 6, 7, 8, and 9</mat-card-title>
    <mat-card-subtitle>
    All references to the definition "License" within the additional terms are instead defined to mean the AGPL-3.0+.
    </mat-card-subtitle>
  </mat-card-header>
  <mat-card-content class="mat-elevation-z1">
<section-start class="centre-output" always>

```python
_print_apache()
```

</section-start>
  </mat-card-content>
  <mat-card-actions align="right">

  <variable-tick name='I agree to the additional terms' required>
    i_agree_to_addional_terms
  </variable-tick>
  </mat-card-actions>
</mat-card>

<br><br><br><br>

<section-output>

```python
if i_agree_to_agpl and i_agree_to_addional_terms:
    with open(license_agreement_file, 'w') as file:
        file.write('')

    print('Record of agreement created at:\n    {}'.format(license_agreement_file))
```

</section-output>