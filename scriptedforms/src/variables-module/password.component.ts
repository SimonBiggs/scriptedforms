// scriptedforms
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compliance with both the Apache-2.0 AND 
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

/*
Component that handles both [string] and [number] inputs.

In the future these should be more intelligently split out. Potentially create
a base class from which the two types of inputs inherit.

The VariableComponent calls Python code to derive its value initially. Each
time the value is changed it then recalls Python code to update the value.
*/

import {
  BehaviorSubject
} from 'rxjs';

import {
  Component, OnInit
} from '@angular/core';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import * as bcrypt from 'bcryptjs';
import * as forge from 'node-forge';
import * as sha3 from 'js-sha3';

// console.log('sha3')
// console.log(sha3)
// console.log('forge')
// console.log(forge)

import { VariableBaseComponent } from './variable-base.component';

@Component({
  selector: 'variable-password',
  template: `<span #variablecontainer *ngIf="variableName === undefined"><ng-content></ng-content></span>
<mat-input-container class="variable-password" *ngIf="variableName">
  <input
  [required]="required"
  matInput matTextareaAutosize
  [disabled]="!isFormReady"
  [placeholder]="placeholderValue"
  [(ngModel)]="plainTextPassword"
  (keyup)="passwordTyping($event.code)"
  (blur)="leavePasswordField()"
  type="password" class="variable-password">
</mat-input-container>`,
styles: [
  `.variable-password {
  width: 100%;
}
`]
})
export class PasswordComponent extends VariableBaseComponent implements OnInit {
  saltPromise: Promise<string>
  plainTextPassword: string
  hashedPassword: string
  rsaPrivateKey: string
  rsaPublicKey: string

  variableValue: string

  passwordObservable: BehaviorSubject<string> = new BehaviorSubject(null);
  
  ngOnInit() {
    let delay = this.passwordObservable.debounceTime(500)
    delay.subscribe(() => {
      this.variableChanged()
    })
  }

  leavePasswordField() {
    if (this.passwordObservable.getValue() != this.plainTextPassword) {
      this.variableChanged()
    }
  }

  passwordTyping(keyCode: string) {
    if ((this.passwordObservable.getValue() != this.plainTextPassword) && (keyCode != 'Enter')){
      this.passwordObservable.next(this.plainTextPassword)
    }
  }

  getSalt(): Promise<string> {
    if (!this.saltPromise) {
      this.saltPromise = bcrypt.genSalt(10)
    }
    return this.saltPromise
  }

  hashPassword(): Promise<string> {
    return this.getSalt().then((salt) => {
      return bcrypt.hash(this.plainTextPassword, salt)
    }).then(hashedPassword => {
      this.hashedPassword = hashedPassword
      return hashedPassword
    })
  }

  async createRsaKeys() {
    let forgeAny: any = forge
    let prng: any = forgeAny.random.createInstance()
    prng.seedFileSync = (needed: number) => {
      return sha3.shake256(this.hashedPassword, needed * 8);
    }
    prng.generate(16)
    let keypair = forge.pki.rsa.generateKeyPair({
      bits: 1028,
      prng: prng
    })
    this.rsaPrivateKey = forge.pki.privateKeyToPem(keypair.privateKey)
    this.rsaPublicKey = forge.pki.publicKeyToPem(keypair.publicKey)

    return this.rsaPublicKey
  }


  onVariableChange(): Promise<void> {
    let promiseDelegate = new PromiseDelegate<void>()
    if (this.plainTextPassword) {
      this.hashPassword().then(() => {
        return this.createRsaKeys()
      })
      .then(() => {
        this.variableValue = this.rsaPublicKey
        promiseDelegate.resolve(null)
      })
    } else {
      this.variableValue = ''
      promiseDelegate.resolve(null)
    }

    return promiseDelegate.promise
   }

   pythonValueReference() {
    const escapedString = this.variableValue
    .replace(/\"/g, '\\"')
    .replace(/\\/g, '\\\\')
    const valueReference = `"""${String(escapedString)}"""`

    return valueReference
  }
 }