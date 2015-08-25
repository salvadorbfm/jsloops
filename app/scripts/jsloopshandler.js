function JSLoopsHandler(context) {
  var that = this;
  this.context = context;
  // this.initialCode = '// JSLoops - GDLJS 2015\n// - engine.DrumKick.trigger(steps[0]);\nfunction play(engine, steps) {\nconsole.log(steps);console.log(engine.context.currentTime);debugger;\n}\n';
  this.initialCode = '// JSLoops - GDLJS 2015\n// - engine.DrumKick.trigger(steps[0]);\nfunction play(engine, steps) {\n\n}\n';
  this.editor = CodeMirror($('#editor')[0], {
    value: this.initialCode,
    theme: '3024-night',
    mode:  'javascript',
    lineNumbers: true,
    tabSize: 2
  });
  this.engine = new JSLoopsEngine(context);

  // Init loop
  setInterval(function() {
    that.engine.looper();
  },200);
  this.bindEvents();
}

// JSLoopsHandler.prototype.

JSLoopsHandler.prototype.bindEvents = function(argument) {
  var that = this;
  this.editor.on('keydown', function(_cm, e) {
    var now = context.currentTime;
    if (e.metaKey && e.keyCode === 13) {
      try {
        eval(that.editor.getValue());
        if (typeof play === 'function' ) {
          that.engine.setMethodToPlay(play);
        }
      } catch (e) {
        console.error('Fatality', e);
      }
    }
  });

}
