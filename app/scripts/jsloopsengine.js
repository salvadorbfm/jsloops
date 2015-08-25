var AudioUtil = {
  getNoiseBuffer : function(context, length) {
    length = length || 1;
    var bufferSize = context.sampleRate,
        buffer = context.createBuffer(1, length * bufferSize, bufferSize),
        output = buffer.getChannelData(0);

    for (var i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    return buffer;
  },
  configureVolumeAndLength: function(node, time, length, min, max, a, d, s, r) {
    if (s<0 || s>1) {
      return
    }
    node.setValueAtTime(min, time);
    node.linearRampToValueAtTime(max,time + (a * length));
    node.linearRampToValueAtTime(min + ((max - min) * s), time + ((a + d) * length));
    node.setValueAtTime(min + ((max - min) * s), time + length - (length * r));
    node.linearRampToValueAtTime(min, time + length);
  }
};

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
  this.noise.buffer = AudioUtil.getNoiseBuffer(this.context);

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

DrumSnare.prototype.trigger = function(time) {
  this.setup();

  this.noiseEnvelope.gain.setValueAtTime(2.2, time);
  this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
  this.noise.start(time)

  this.osc.frequency.setValueAtTime(100, time);
  this.oscEnvelope.gain.setValueAtTime(0.7, time);
  this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
  this.osc.start(time)

  this.osc.stop(time + 0.2);
  this.noise.stop(time + 0.2);
};

function DrumHiHat(context) {
  this.context = context;
}

DrumHiHat.prototype.setup = function() {
  this.noise = this.context.createBufferSource();
  this.noise.buffer = AudioUtil.getNoiseBuffer(this.context);

  var noiseFilter = this.context.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 500;
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

DrumHiHat.prototype.trigger = function(time) {
  this.setup();

  this.noiseEnvelope.gain.setValueAtTime(0.8, time);
  this.noiseEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
  this.noise.start(time)

  this.osc.frequency.setValueAtTime(400, time);
  this.oscEnvelope.gain.setValueAtTime(3.0, time);
  this.oscEnvelope.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
  this.osc.start(time)

  this.osc.stop(time + 0.2);
  this.noise.stop(time + 0.2);
};

function BasicSynth(context, notes) {
  this.context = context;
  this.notes = notes;
}

BasicSynth.prototype.setup = function(note) {
  this.radius = 12;
  this.oscillatorType = 'sawtooth';

  this.gainNode = this.context.createGain();

  this.filter = this.context.createBiquadFilter();
  this.filter.Q.value = 10;                         // Experiment with this
  this.oscillatorA = this.context.createOscillator();
  this.oscillatorB = this.context.createOscillator();
  this.oscillatorA.type = 'sawtooth';
  this.oscillatorB.type = 'sawtooth';
  this.oscillatorA.detune.value = this.radius;
  this.oscillatorB.detune.value = this.radius * -1;
  this.oscillatorA.frequency.value = this.notes[note];
  this.oscillatorB.frequency.value = this.notes[note];

  this.oscillatorA.connect(this.filter);
  this.oscillatorB.connect(this.filter);
  this.filter.connect(this.gainNode);
  this.gainNode.connect(this.context.destination);

}

BasicSynth.prototype.trigger = function(time, length, note, volume) {
  volume = volume || 0.2;
  this.setup(note);

  AudioUtil.configureVolumeAndLength(this.gainNode.gain, time, length, 0, volume, 0.01, 0.1, 0.8, 0.1);
  AudioUtil.configureVolumeAndLength(this.filter.frequency, time, length, 500, 500 + 2000, 0.01, 0.1, 0.8, 0.1);

  this.oscillatorA.start(time);
  this.oscillatorB.start(time);

  this.oscillatorA.stop(time+length);
  this.oscillatorB.stop(time+length);
}

function JSLoopsEngine (context) {
  this.context = context;
  this.notes = [ 16.35,    17.32,    18.35,    19.45,    20.6,     21.83,    23.12,    24.5,     25.96,    27.5,  29.14,    30.87,
           32.7,     34.65,    36.71,    38.89,    41.2,     43.65,    46.25,    49,       51.91,    55,    58.27,    61.74,
           65.41,    69.3,     73.42,    77.78,    82.41,    87.31,    92.5,     98,       103.83,   110,   116.54,   123.47,
           130.81,   138.59,   146.83,   155.56,   164.81,   174.61,   185,      196,      207.65,   220,   233.08,   246.94,
           261.63,   277.18,   293.66,   311.13,   329.63,   349.23,   369.99,   392,      415.3,    440,   466.16,   493.88,
           523.25,   554.37,   587.33,   622.25,   659.26,   698.46,   739.99,   783.99,   830.61,   880,   932.33,   987.77,
           1046.5,   1108.73,  1174.66,  1244.51,  1318.51,  1396.91,  1479.98,  1567.98,  1661.22,  1760,  1864.66,  1975.53,
           2093,     2217.46,  2349.32,  2489.02,  2637.02,  2793.83,  2959.96,  3135.96,  3322.44,  3520,  3729.31,  3951.07,
           4186.01,  4434.92,  4698.64,  4978 ];
  this.DrumSnare = new DrumSnare(context);
  this.DrumKick = new DrumKick(context);
  this.DrumHiHat = new DrumHiHat(context);
  this.BasicSynth = new BasicSynth(context, this.notes);

  this.nSteps = 16;
  this.bpm = 120;
  this.stepTime - 0;
  this.timeOffset = 0;

  this.calculateStepTime();
}

JSLoopsEngine.prototype.calculateStepTime = function() {
  this.stepTime = 60.0/(this.bpm * 4);
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

  this.calculateStepTime();
  if (this.methodToPlay) {
    this.timeOffset = (this.timeOffset === 0)?(this.context.currentTime):(this.timeOffset);
    for (i = 0; i < this.nSteps; i++) {
      steps.push(this.timeOffset + (i * this.stepTime));
    }
    this.methodToPlay(this, steps);
    this.timeOffset += this.stepTime * this.nSteps;
  }
}
