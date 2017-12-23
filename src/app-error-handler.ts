// jupyterlab-form
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// the GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination.

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the Apache-2.0 and the AGPL-3.0+ for the specific language governing 
// permissions and limitations under the Apache-2.0 and the AGPL-3.0+.

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
    errorbox[0].innerHTML = `<h2>Error</h2>
<p>
  While rendering your form an error occured.
</p>
<p>
  The error from the Angular compiler is printed below:
</p>
<pre style="white-space: pre-wrap;">
  ` + error + '</pre>';
   }

   // delegate to the default handler
   super.handleError(error);
  }
}
