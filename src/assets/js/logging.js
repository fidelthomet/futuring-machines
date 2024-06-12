const BACKEND_URL = '/backend'

import Delta from 'quill-delta'

export const logUserAction = async (action, data = undefined) => {
  // Create the log entry
  const logEntry = { action }
  if (data !== undefined) { logEntry.data = data }

  // Send a request to your server to write the log entry to a file
  const response = await fetch(BACKEND_URL + '/log', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logEntry),
  })
  if (!response.ok) {
    console.log("Failed to connect to backend for logging");
    console.log(logEntry)
  }
}

const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

const tapTap2Diff = (json) => {
  const operations = json.content.filter(elements => elements.content !== undefined).map(elements => elements.content.map(element => {
    const operation = {insert: element.text}
    if (element.marks && element.marks.filter(mark => mark.type === "mark-ai").length > 0) {
      operation.attributes = {ai: true}
    }
    return operation})
  ).reduce((accumulator, currentValue) =>
    accumulator.concat({insert:"\n"}).concat(currentValue),
    []
  )
  return new Delta(operations);
}

export const deltaLogger = () => {
  let currentDelta = new Delta([]);
  const debouncedLogDelta = debounce((editor) => {
    const newDelta = tapTap2Diff(editor.getJSON())
    logUserAction("text-change", currentDelta.diff(newDelta))
    currentDelta = newDelta
  }, 1000) // 1 second delay
  return debouncedLogDelta
}


