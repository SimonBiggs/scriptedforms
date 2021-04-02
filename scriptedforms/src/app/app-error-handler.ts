// Scripted Forms -- Making GUIs easy for everyone on your team.
// Copyright (C) 2017 Simon Biggs

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.


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
    //    const errorbox = document.getElementsByClassName('errorbox');
    //    if (errorbox.length > 0) {
    //     errorbox[0].innerHTML = `<h2>Javascript Error:</h2>
    // <p>
    //   A Javascript error has occured. This could be due to an error within your
    //   ScriptedForms template or an issue with ScriptedForms itself.
    // </p>
    // <div class="jp-OutputArea-child">
    //   <div class="jp-OutputPrompt"></div>
    //   <div class="jp-RenderedText" data-mime-type="application/vnd.jupyter.stderr">
    //     <pre style="white-space: pre-wrap;">
    //   ` + error + '</pre></div></div>';
    //    }

    // delegate to the default handler
    super.handleError(error);
  }
}
