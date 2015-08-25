// var cm = CodeMirror($('#editor')[0], {
//   value: '// jsLoops - 2015 ',
//   theme: '3024-night',
//   mode:  'javascript',
//   lineNumbers: true,
//   tabSize: 2
// });
//
// var context = new AudioContext();
// var Engine = new JSLoopsEngine(context);
//
// cm.on('keydown', function(_cm, e) {
//   var now = context.currentTime;
//   console.log(e.metaKey, e.keyCode);
//   if (e.metaKey && e.keyCode === 13) {
//     Engine.DrumKick.trigger(now + 0.5);
//     Engine.DrumKick.trigger(now + 1.5);
//     Engine.DrumKick.trigger(now + 2.5);
//   }
// });

var context = new AudioContext(),
    handler = new JSLoopsHandler(context);
