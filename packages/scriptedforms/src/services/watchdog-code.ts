export 
const watchdogJustFirstTimeCode = `
import os
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, FileModifiedEvent

class MyHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if type(event) == FileModifiedEvent:
            print(os.path.relpath(event.src_path))

event_handler = MyHandler()
observer = Observer()
observer.schedule(event_handler, path='.', recursive=True)
observer.start()
`

export
const watchdogLoopCode = `
while True:
    time.sleep(1)
`