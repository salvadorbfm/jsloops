var cm = CodeMirror($('#editor')[0], {
  value: '// jsLoops - 2015 ',
  theme: '3024-night',
  mode:  'javascript',
  lineNumbers: true,
  tabSize: 2
});

cm.on('keydown', function(_cm, e) {
  console.log(e.metaKey, e.keyCode);
});
