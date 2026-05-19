// Synthesize a Lego brick "snap/click" sound using Web Audio API
// No external audio files needed — generated programmatically

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioContext;
}

export function playBrickClick() {
  try {
    const ctx = getAudioContext();

    // Layer 1: Initial sharp "click" attack
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = "square";
    clickOsc.frequency.setValueAtTime(1800, ctx.currentTime);
    clickOsc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);
    clickGain.gain.setValueAtTime(0.25, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    clickOsc.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickOsc.start(ctx.currentTime);
    clickOsc.stop(ctx.currentTime + 0.06);

    // Layer 2: Low "thud" body for the snap feel
    const thudOsc = ctx.createOscillator();
    const thudGain = ctx.createGain();
    thudOsc.type = "sine";
    thudOsc.frequency.setValueAtTime(150, ctx.currentTime);
    thudOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.08);
    thudGain.gain.setValueAtTime(0.3, ctx.currentTime);
    thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    thudOsc.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudOsc.start(ctx.currentTime);
    thudOsc.stop(ctx.currentTime + 0.08);

    // Layer 3: Noise burst for plastic texture
    const bufferSize = ctx.sampleRate * 0.04;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.15;
    }
    const noiseSource = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 3000;
    noiseFilter.Q.value = 1.5;
    noiseSource.buffer = noiseBuffer;
    noiseGain.gain.setValueAtTime(0.2, ctx.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noiseSource.start(ctx.currentTime);
  } catch {
    // Silently fail if audio context not available
  }
}
