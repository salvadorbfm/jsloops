function JSLoopsHandler(context) {
  var that = this;
  var codeString = '  for (var i=0; i<steps.length; i++) { \n' +
                  '      // engine.DrumHiHat.trigger(steps[i]); \n' +
                  '  } \n' +
                  '  engine.DrumKick.trigger(steps[0]); \n' +
                  '  engine.DrumSnare.trigger(steps[2]); \n' +
                  '  engine.DrumKick.trigger(steps[3]); \n' +
                  '  engine.DrumSnare.trigger(steps[4]);  \n' +
                  '  engine.DrumHiHat.trigger(steps[8]); \n' +
                  '  engine.DrumHiHat.trigger(steps[10]); \n';

  this.context = context;
  this.initialCode = '// JSLoops \n' +
                     'function play(engine, steps) {\n' +  codeString + '}\n';

  this.editor = CodeMirror($('#editor')[0], {
    value: this.initialCode,
    theme: '3024-night',
    mode:  'javascript',
    keyMap: 'sublime',
    lineNumbers: true,
    cursorScrollMargin: 2,
    tabSize: 2
  });
  this.engine = new JSLoopsEngine(context);

  // Init loop
  setInterval(function() {
    that.engine.looper();
  },200);
  this.bindEvents();
}

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
