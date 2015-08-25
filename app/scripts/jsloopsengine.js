function DrumKick(context) {
  this.context = context;
}

DrumKick.prototype.setup = function() {
  this.osc = this.context.createOscillator();
  this.gain = this.context.createGain();
  this.osc.connect(this.gain);
  this.gain.connect(this.context.destination)
};

DrumKick.prototype.trigger = function(time) {
  this.setup();

  this.osc.frequency.setValueAtTime(150, time);
  this.gain.gain.setValueAtTime(1, time);

  this.osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
  this.gain.gain.exponentialRampToValueAtTime(0.01, time + 0.5);

  this.osc.start(time);

  this.osc.stop(time + 0.5);
};

function DrumSnare(context) {
  this.context = context;
};

DrumSnare.prototype.setup = function() {
  this.noise = this.context.createBufferSource();
  this.noise.buffer = this.noiseBuffer();

  var noiseFilter = this.context.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;
  this.noise.connect(noiseFilter);

  this.noiseEnvelope = this.context.createGain();
  noiseFilter.connect(this.noiseEnvelope);

  this.noiseEnvelope.connect(this.context.destination);

  this.osc = this.context.createOscillator();
  this.osc.type = 'triangle';

  this.oscEnvelope = this.context.createGain();
  this.osc.connect(this.oscEnvelope);
  this.oscEnvelope.connect(this.context.destination);
};

DrumSnare.prototype.noiseBuffer = function() {
  var bufferSize = this.context.sampleRate;
  var buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
  var output = buffer.getChannelData(0);

  for (var i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  return buffer;
};

DrumSnare.prototype.trigger = function(time) {
  this.setup();

  this.noiseEnvelope.gain.setValueAtTime(1, time);
  this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
  this.noise.start(time)

  this.osc.frequency.setValueAtTime(100, time);
  this.oscEnvelope.gain.setValueAtTime(0.7, time);
  this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
  this.osc.start(time)

  this.osc.stop(time + 0.2);
  this.noise.stop(time + 0.2);
};

function JSLoopsEngine (context) {
  this.context = context;
  this.DrumSnare = new DrumSnare(context);
  this.DrumKick = new DrumKick(context);

  this.nSteps = 16;
  this.bpm = 120;
  this.stepTime = 60.0/(this.bpm * 4);
  this.timeOffset = 0;
}

JSLoopsEngine.prototype.setMethodToPlay = function(methodToPlay) {
  this.methodToPlay = methodToPlay;
}

JSLoopsEngine.prototype.looper = function() {
  var i = 0,
      steps = [];

  if (this.timeOffset - this.context.currentTime > 0.4) {
    return;
  }

  if (this.methodToPlay) {
    this.timeOffset = (this.timeOffset === 0)?(this.context.currentTime):(this.timeOffset);
    for (i = 0; i < this.nSteps; i++) {
      steps.push(this.timeOffset + (i * this.stepTime));
    }
    this.methodToPlay(this, steps);
    this.timeOffset += this.stepTime * this.nSteps;
  }
}
