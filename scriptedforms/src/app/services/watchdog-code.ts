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

export
    const startWatchdogSessionCode = `
try:
    observer
    raise AssertionError("observer shouldn't exist yet")
except NameError:
    import os
    from watchdog.observers import Observer
    from watchdog.events import FileSystemEventHandler, FileModifiedEvent

    class MyHandler(FileSystemEventHandler):
        def on_modified(self, event):
            print('absolute: {}'.format(os.path.abspath(event.src_path)))
            try:
                print('relative: {}'.format(os.path.relpath(event.src_path)))
            finally:
                pass

    event_handler = MyHandler()
    observer = Observer()
    observer.start()
`;

export
    function addObserverPathCode(observerPath: string) {
    return `
next_path = os.path.dirname(os.path.abspath(
    os.path.expanduser(os.path.expandvars('${observerPath}'))))
observer.schedule(event_handler, path=next_path)`;
}
