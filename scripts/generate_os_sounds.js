import fs from 'fs';
import path from 'path';

// Helper to write a 16-bit PCM Mono WAV buffer
function createWavBuffer(sampleRate, samples) {
  const numChannels = 1;
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // fmt subchunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(numChannels, 22); // NumChannels
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(byteRate, 28); // ByteRate
  buffer.writeUInt16LE(blockAlign, 32); // BlockAlign
  buffer.writeUInt16LE(16, 34); // BitsPerSample

  // data subchunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write audio samples
  for (let i = 0; i < samples.length; i++) {
    // Clamp sample between -1.0 and 1.0
    const s = Math.max(-1, Math.min(1, samples[i]));
    const intSample = s < 0 ? s * 0x8000 : s * 0x7FFF;
    buffer.writeInt16LE(Math.floor(intSample), 44 + i * 2);
  }

  return buffer;
}

const sampleRate = 22050; // High quality and very compact size (< 50 KB)

// 1. boot.mp3 (Gentle digital chime chord, 1.4 sec)
function generateBoot() {
  const duration = 1.4;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  // Major 9th chord: F4 (349), A4 (440), C5 (523), E5 (659), G5 (784)
  const freqs = [349.23, 440.0, 523.25, 659.25, 783.99];

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let val = 0;
    freqs.forEach((f, idx) => {
      const noteDelay = idx * 0.08;
      if (t >= noteDelay) {
        const noteT = t - noteDelay;
        const env = Math.exp(-noteT * 2.8) * Math.sin(Math.min(1, noteT * 20) * Math.PI * 0.5);
        // fundamental + gentle shimmer harmonic
        const tone = Math.sin(2 * Math.PI * f * noteT) * 0.6 + Math.sin(4 * Math.PI * f * noteT) * 0.2;
        val += tone * env * 0.18;
      }
    });
    samples[i] = val;
  }
  return samples;
}

// 2. click.mp3 (Short, soft tap, ~0.04 sec)
function generateClick() {
  const duration = 0.04;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 90);
    const freq = 650 - t * 4000;
    const tone = Math.sin(2 * Math.PI * freq * t);
    samples[i] = tone * env * 0.35;
  }
  return samples;
}

// 3. open_window.mp3 (Gentle whoosh-in + chime, ~0.22 sec)
function generateOpenWindow() {
  const duration = 0.22;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Rising sweep + tone
    const env = Math.sin((t / duration) * Math.PI);
    const freq = 320 + Math.pow(t / duration, 2) * 550;
    const sweep = Math.sin(2 * Math.PI * freq * t) * 0.25;
    const pop = (t > 0.12 ? Math.sin(2 * Math.PI * 880 * (t - 0.12)) * Math.exp(-(t - 0.12) * 25) * 0.2 : 0);
    samples[i] = (sweep + pop) * env * 0.35;
  }
  return samples;
}

// 4. close_window.mp3 (Reverse gentle whoosh-out, ~0.18 sec)
function generateCloseWindow() {
  const duration = 0.18;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 14);
    const freq = 680 - Math.pow(t / duration, 1.5) * 380;
    const tone = Math.sin(2 * Math.PI * freq * t);
    samples[i] = tone * env * 0.3;
  }
  return samples;
}

// 5. mail_new.mp3 (Delicate two-tone crystal chime, ~0.45 sec)
function generateMailNew() {
  const duration = 0.45;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  const notes = [{ f: 587.33, d: 0 }, { f: 880.0, d: 0.12 }]; // D5, A5

  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    let val = 0;
    notes.forEach((n) => {
      if (t >= n.d) {
        const dt = t - n.d;
        const env = Math.exp(-dt * 8);
        const tone = Math.sin(2 * Math.PI * n.f * dt) * 0.7 + Math.sin(4 * Math.PI * n.f * dt) * 0.2;
        val += tone * env * 0.25;
      }
    });
    samples[i] = val;
  }
  return samples;
}

// 6. error_soft.mp3 (Kind, gentle droplet bubble, ~0.15 sec)
function generateErrorSoft() {
  const duration = 0.15;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 22);
    // Droplet bend
    const freq = 420 + Math.sin(t * 120) * 80;
    const tone = Math.sin(2 * Math.PI * freq * t);
    samples[i] = tone * env * 0.25;
  }
  return samples;
}

// 7. laptop_close.mp3 (Gentle warm lid click / shutdown chime, ~0.35 sec)
function generateLaptopClose() {
  const duration = 0.35;
  const totalSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(totalSamples);
  for (let i = 0; i < totalSamples; i++) {
    const t = i / sampleRate;
    // Gentle low thump + descending triad
    const thumpEnv = Math.exp(-t * 30);
    const thump = Math.sin(2 * Math.PI * 110 * t) * thumpEnv * 0.3;

    const chimeEnv = Math.exp(-t * 10);
    const chime = (Math.sin(2 * Math.PI * 440 * t) + Math.sin(2 * Math.PI * 330 * t)) * chimeEnv * 0.15;
    samples[i] = (thump + chime) * 0.4;
  }
  return samples;
}

// Write to public/assets/sounds/os/
const outputDirs = [
  path.join(process.cwd(), 'public', 'assets', 'sounds', 'os'),
];

outputDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const soundGenerators = {
  'boot.mp3': generateBoot,
  'click.mp3': generateClick,
  'open_window.mp3': generateOpenWindow,
  'close_window.mp3': generateCloseWindow,
  'mail_new.mp3': generateMailNew,
  'error_soft.mp3': generateErrorSoft,
  'laptop_close.mp3': generateLaptopClose,
};

for (const [filename, gen] of Object.entries(soundGenerators)) {
  const samples = gen();
  const wavBuffer = createWavBuffer(sampleRate, samples);
  outputDirs.forEach((dir) => {
    fs.writeFileSync(path.join(dir, filename), wavBuffer);
  });
  console.log(`Generated ${filename} (${wavBuffer.length} bytes)`);
}

console.log('All OS sounds generated successfully!');
