<!-- Scripted Forms

Copyright (C) 2018 Simon Biggs

This software is licensed under both the Apache License, Version 2.0
(the "Apache-2.0") and the
GNU Affrero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version (the "AGPL-3.0+").

You may not use this file except in compliance with both the Apache-2.0 and
the AGPL-3.0+.

Copies of these licenses can be found at:

* AGPL-3.0+ -- https://www.gnu.org/licenses/agpl-3.0.txt
* Apache-2.0 -- https://www.apache.org/licenses/LICENSE-2.0.html

Unless required by applicable law or agreed to in writing, software
distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an **"AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND**, either express or implied. See
the Apache-2.0 and the AGPL-3.0+ for the specific language governing permissions and
limitations under the Apache-2.0 and the AGPL-3.0+. -->

<!-- markdownlint-disable MD033 -->

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

# Create a New User

<section-start>

```python
from IPython.display import display, Markdown

userid = None
fullname = None
i_agree_to_agpl = False
i_agree_to_apache = False
```

</section-start>

<section-start always>

```python
publicKey = None
salt = None
```

</section-start>

<variable-string placeholder="User ID" required>
userid
</variable-string>

<variable-string placeholder="Your full name" required>
fullname
</variable-string>

Create a new "salt" variable that provides the salt in a similar way to how
conditional works.

<section-live>
<variable-password placeholder="Create a password" required>
publicKey
</variable-password>

```python
print(publicKey)
```

</section-live>

## Software license agreement

Scripted Forms

Copyright (C) 2018 Simon Biggs

This software is licensed under both the Apache License, Version 2.0
(the "Apache-2.0") and the
GNU Affrero General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version (the "AGPL-3.0+").

You may not use this software except in compliance with both the Apache-2.0 and
the AGPL-3.0+.

Full copies of the Apache-2.0 and the AGPL-3.0+ are provided below for your
reading. Copies may also be found online:

* AGPL-3.0+ -- https://www.gnu.org/licenses/agpl-3.0.txt
* Apache-2.0 -- https://www.apache.org/licenses/LICENSE-2.0.html

Unless required by applicable law or agreed to in writing, software
distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an **"AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND**, either express or implied. See
the Apache-2.0 and the AGPL-3.0+ for the specific language governing permissions and
limitations under the Apache-2.0 and the AGPL-3.0+.

<br>

<mat-card class="mat-elevation-z8">
  <mat-card-header>
    <mat-card-title>Apache-2.0</mat-card-title>
    <mat-card-subtitle>The Apache-2.0 License</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content class="mat-elevation-z1">
<section-start class="centre-output" always>

```python
scriptedforms.print_apache()
```

</section-start>
  </mat-card-content>
  <mat-card-actions align="right">
  <variable-tick placeholder="I agree to the terms and conditions of the Apache-2.0" required>
    i_agree_to_apache
  </variable-tick>
  </mat-card-actions>
</mat-card>

<br>

<mat-card class="mat-elevation-z8">
  <mat-card-header>
    <mat-card-title>AGPL-3.0+</mat-card-title>
    <mat-card-subtitle>The GNU Affrero General Public License version 3.0+</mat-card-subtitle>
  </mat-card-header>
  <mat-card-content class="mat-elevation-z1">
<section-start class="centre-output" always>

```python
scriptedforms.print_agpl()
```

</section-start>
  </mat-card-content>
  <mat-card-actions align="right">
  <variable-tick placeholder="I agree to the terms and conditions of the AGPL-3.0+" required>
    i_agree_to_agpl
  </variable-tick>
  </mat-card-actions>
</mat-card>

## Your generated user file

The user file itself should just be a form results files

<section-output>

```python
form_completed = (
  i_agree_to_agpl and
  i_agree_to_apache and
  userid is not None and
  fullname is not None and
  publicKey is not None)

statement_of_license_agreement = (
  "I, {},\n"
  "    agree to the terms and conditions for the use, reproduction, and\n"
  "    distribution of this software which is licensed under the combination of\n"
  "    the Apache License, Version 2.0 and the GNU Affrero General Public\n"
  "    License, Version 3.0+.".format(fullname))

if form_completed:
  user_file_contents = """{{
  "userid": "{}",
  "fullname": "{}",
  "salt": "{}",
  "publicKey": "{}",
  "statement_of_license_agreement": "{}"
}}""".format(userid, fullname, salt, publicKey, statement_of_license_agreement)

  print(user_file_contents)
else:
  print(
    "Your user file cannot yet be generated as you have not yet completed the "
    "following form fields:\n")

if userid is None or userid == '':
  print("   * A unique username")

if fullname is None or userid == '':
  print("   * Your full name")

if publicKey is None:
  print("   * Password")

if not i_agree_to_apache:
  print("   * Confirming that you agree to the Apache-2.0")

if not i_agree_to_agpl:
  print("   * Confirming that you agree to the AGPL-3.0+")
```

</section-output>

## Confirm and Save

<section-output class="centre-output no-word-break">

```python
print(statement_of_license_agreement)
```

</section-output>

<section-button name="Confirm and Save" conditional="form_completed">

</section-button>

<section-button>

```python
exec(scriptedforms_variable_handler.fetch_code)
```

</section-button>

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
