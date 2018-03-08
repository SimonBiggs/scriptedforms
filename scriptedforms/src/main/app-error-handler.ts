// Scripted Forms -- Making GUIs easy for everyone on your team.
// Copyright (C) 2017 Simon Biggs

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version (the "AGPL-3.0+").

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License and the additional terms for more
// details.

// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

// ADDITIONAL TERMS are also included as allowed by Section 7 of the GNU
// Affrero General Public License. These aditional terms are Sections 1, 5,
// 6, 7, 8, and 9 from the Apache License, Version 2.0 (the "Apache-2.0")
// where all references to the definition "License" are instead defined to
// mean the AGPL-3.0+.

// You should have received a copy of the Apache-2.0 along with this
// program. If not, see <http://www.apache.org/licenses/LICENSE-2.0>.


/*
Handler to print error messages at the top of the form.

If the user makes an error within the form template at least the user will be
presented with some form of error message.

In the future the display of this message could integrate better with
jupyterlab.
*/

import { ErrorHandler } from '@angular/core';

export class AppErrorHandler extends ErrorHandler {

  handleError(error: any) {
   const errorbox = document.getElementsByClassName('errorbox');
   if (errorbox.length > 0) {
    errorbox[0].innerHTML = `<h2>Javascript Error:</h2>
<p>
  A Javascript error has occured. This could be due to an error within your
  ScriptedForms template or an issue with ScriptedForms itself.
</p>
<div class="jp-OutputArea-child">
  <div class="jp-OutputPrompt"></div>
  <div class="jp-RenderedText" data-mime-type="application/vnd.jupyter.stderr">
    <pre style="white-space: pre-wrap;">
  ` + error + '</pre></div></div>';
   }

   // delegate to the default handler
   super.handleError(error);
  }
}
