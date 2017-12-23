// scriptedforms
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination (the "Combined Licenses").

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Combined Licenses is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See 
// the Combined Licenses for the specific language governing permissions and 
// limitations under the Combined Licenses.

import { Injectable } from '@angular/core';

import {
  IModelDB, IObservableString
 } from '@jupyterlab/observables';

 import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  DocumentModel
} from '@jupyterlab/docregistry';


export
namespace FormModel {
  /**
   * An options object for initializing a notebook model.
   */
  export
  interface IOptions {
    /**
     * The language preference for the model.
     */
    languagePreference?: string;

    /**
     * A modelDB for storing notebook data.
     */
    modelDB?: IModelDB;

    // formPath: string;
  }
}

export
class FormModel extends DocumentModel {
  template: IObservableString;

  constructor(options: FormModel.IOptions) {
    super(options.languagePreference, options.modelDB);
    // this.modelDB.setValue('formPath', options.formPath);
    // this.modelDB.createString('formPath').insert(0, './testing.form.md')
    this.modelDB.createString('template')
    this.template = this.modelDB.get('template') as IObservableString;
  }

  /**
   * Dispose of the resources held by the model.
   */
  dispose(): void {
    // do something

    // then
    super.dispose();
  }

  /**
   * Serialize the model to a string.
   */
  toString(): string {
    return JSON.stringify(this.toJSON());
  }

  /**
   * Deserialize the model from a string.
   */
  fromString(value: string): void {
    this.fromJSON(JSON.parse(value));
  }

  /**
   * Serialize the model to JSON.
   */
  toJSON() {
    return {
      template: this.getTemplate()
    };
  }

  /**
   * Deserialize the model from JSON.
   */
  fromJSON(value: any): void {
    this.setTemplate(value.template);
  }

  setTemplate(template: string) {
    // console.log(template)
    this.template.clear()
    this.template.insert(0, template);

    // console.log(this.template.text)
  }

  getTemplate() {
    return this.template.text
  }
}

@Injectable()
export class JupyterlabModelService {
  formModel: FormModel
  modelReady = new PromiseDelegate<void>();
  template: IObservableString

  initialiseModel() {
    this.formModel = new FormModel({});
    this.modelReady.resolve(undefined);
  }

  setTemplate(template: string) {
    this.formModel.setTemplate(template);
  }

  getTemplate() {
    return this.formModel.getTemplate();
  }
}
