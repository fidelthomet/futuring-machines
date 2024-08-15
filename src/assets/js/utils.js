function centerEditor(editor, instant, limit = 105) {
  const cursorStartY = editor.view.coordsAtPos(editor.view.state.selection.from).top
  const cursorEndY = editor.view.coordsAtPos(editor.view.state.selection.to).bottom
  const cursorHeight = cursorEndY - cursorStartY
  if (cursorHeight > limit) return
  const cursorCenter = cursorStartY + cursorHeight / 2
  const windowCenter = window.innerHeight / 3
  const offset = cursorCenter - windowCenter
  window.scrollBy({
    top: offset,
    left: 0,
    behavior: instant ? 'instant' : 'smooth'
  })
}

function generatePattern(width, height, segments, moveFactor, close = false) {
  let pattern = `M${r(width)},${r(height)}`
  for (let i = 0; i < segments; i++) {
    const segmentType = r(1) < moveFactor ? 'M' : 'L'
    if (segmentType === 'M') i--
    pattern += `${segmentType}${r(width)},${r(height)}`
  }
  if (close) pattern += 'Z'
  return pattern
}

function r(max = 1, round = 0.5) {
  return Math.floor((Math.random() * (max + round)) / round) * round
}

export { centerEditor, generatePattern }
