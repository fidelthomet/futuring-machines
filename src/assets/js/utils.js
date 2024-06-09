function centerEditor(editor, instant) {
  const cursorStartY = editor.view.coordsAtPos(editor.view.state.selection.from).top
  const cursorEndY = editor.view.coordsAtPos(editor.view.state.selection.to).bottom
  const cursorHeight = cursorEndY - cursorStartY
  const cursorCenter = cursorStartY + cursorHeight / 2
  const windowCenter = window.innerHeight / 2
  const offset = cursorCenter - windowCenter
  window.scrollBy({
    top: offset,
    left: 0,
    behavior: instant ? 'instant' : 'smooth'
  })
}

export { centerEditor }
