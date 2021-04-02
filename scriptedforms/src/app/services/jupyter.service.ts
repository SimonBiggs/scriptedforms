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

import { Injectable } from '@angular/core';

import {
  ServiceManager, ContentsManager
} from '@jupyterlab/services';

@Injectable()
export class JupyterService {
  serviceManager: ServiceManager;
  contentsManager: ContentsManager;

  setServiceManager(serviceManager: ServiceManager) {
    this.serviceManager = serviceManager;
  }

  setContentsManager(contentsManager: ContentsManager) {
    this.contentsManager = contentsManager;
  }
}
