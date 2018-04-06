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
The data model of the form results files.

Not yet implemented.
*/


import {
  DocumentModel, DocumentRegistry
} from '@jupyterlab/docregistry';

import {
 IModelDB, IObservableString
} from '@jupyterlab/observables';

import {
  Contents
} from '@jupyterlab/services';



// export
// interface IFormModel extends DocumentRegistry.IModel {
//   readonly formPath: string;
// }

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



export
namespace FormModelFactory {
  export
  interface IOptions {
    // formPath: string
  }
}

export
class FormModelFactory implements DocumentRegistry.IModelFactory<DocumentRegistry.IModel> {
  private _disposed = false;
  // formPath: string;

  constructor(options: FormModelFactory.IOptions) {
    // this.formPath = options.formPath;
  }

  /**
   * The name of the model.
   */
  get name(): string {
    return 'form-results';
  }

  /**
   * The content type of the file.
   */
  get contentType(): Contents.ContentType {
    return 'file';
  }

  /**
   * The format of the file.
   */
  get fileFormat(): Contents.FileFormat {
    // not sure why I can't put 'json' here
    return 'text';
  }

  /**
   * Get whether the model factory has been disposed.
   */
  get isDisposed(): boolean {
    return this._disposed;
  }

  /**
   * Dispose of the model factory.
   */
  dispose(): void {
    this._disposed = true;
  }

  /**
   * Create a new model for a given path.
   *
   * @param languagePreference - An optional kernel language preference.
   *
   * @returns A new document model.
   */
  createNew(languagePreference?: string, modelDB?: IModelDB): DocumentRegistry.IModel {
    // let formPath = this.formPath;
    return new FormModel({ languagePreference, modelDB });
  }

  /**
   * Get the preferred kernel language given a path.
   */
  preferredLanguage(path: string): string {
    return '';
  }
}
