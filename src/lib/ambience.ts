/**
 * Ambient soundscapes, synthesised in the browser and mixed live.
 *
 * Several sounds can play at once, each with its own level, so rain over a fire
 * is a mix rather than a choice. Every sound is built from noise, oscillators
 * and filters rather than an audio file, which buys three things a recording
 * cannot: the site ships no extra megabytes and stays a pure static export, the
 * loops are endless with no seam to hear, and there is no sample licence to
 * honour.
 *
 * The trade is that this only suits textures and simple events - rain, surf,
 * fire, bells, ticks. Sounds carrying recognisable detail (a cafe, an airport,
 * a train, birdsong) cannot be faked this way and are deliberately absent
 * rather than included badly.
 *
 * Nothing is created until the listener presses play: a context opened before a
 * user gesture is suspended by the browser anyway, and this page should never
 * make noise unasked.
 */

export type AmbienceId =
  | "rain"
  | "leaves"
  | "thunder"
  | "waves"
  | "fire"
  | "wind"
  | "crickets"
  | "chimes"
  | "bowl"
  | "clock"
  | "fan"
  | "underwater"
  | "white";

export const AMBIENCES: {
  id: AmbienceId;
  label: string;
  /** Lucide icon name, resolved by the component. */
  icon: string;
}[] = [
  { id: "rain", label: "Rain", icon: "CloudRain" },
  { id: "leaves", label: "Rain on Leaves", icon: "Leaf" },
  { id: "thunder", label: "Thunder", icon: "Zap" },
  { id: "waves", label: "Waves", icon: "Waves" },
  { id: "fire", label: "Fireside", icon: "Flame" },
  { id: "wind", label: "Wind", icon: "Wind" },
  { id: "crickets", label: "Crickets", icon: "Bug" },
  { id: "chimes", label: "Wind Chimes", icon: "Bell" },
  { id: "bowl", label: "Singing Bowl", icon: "Disc3" },
  { id: "clock", label: "Clock", icon: "Clock" },
  { id: "fan", label: "Ceiling Fan", icon: "Fan" },
  { id: "underwater", label: "Underwater", icon: "Droplet" },
  { id: "white", label: "White Noise", icon: "AudioLines" },
];

const FADE = 0.6;
/** Ceiling on the master gain, so even "full" stays background. */
const MAX_GAIN = 0.5;

/** Four seconds is long enough that looping noise reveals no period. */
function noiseBuffer(ctx: AudioContext, kind: "white" | "brown") {
  const length = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (kind === "white") {
    for (let i = 0; i < length; i += 1) data[i] = Math.random() * 2 - 1;
    return buffer;
  }

  // Brown noise: integrate white noise with a leak. That tilts the spectrum
  // downwards and gives the low weight wind, surf and rumble need.
  let last = 0;
  for (let i = 0; i < length; i += 1) {
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.5;
  }
  return buffer;
}

type Layer = {
  gain: GainNode;
  nodes: AudioScheduledSourceNode[];
  timers: ReturnType<typeof setTimeout>[];
};

export class AmbienceMixer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private white: AudioBuffer | null = null;
  private brown: AudioBuffer | null = null;
  private layers = new Map<AmbienceId, Layer>();
  private masterVolume = 0.7;
  private disposed = false;

  get playing() {
    return this.layers.size > 0;
  }

  private ensureContext() {
    if (this.ctx) return this.ctx;
    type WithLegacy = typeof window & { webkitAudioContext?: typeof AudioContext };
    const Ctor = window.AudioContext ?? (window as WithLegacy).webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = this.masterVolume * MAX_GAIN;
    this.master.connect(this.ctx.destination);
    this.white = noiseBuffer(this.ctx, "white");
    this.brown = noiseBuffer(this.ctx, "brown");
    return this.ctx;
  }

  async enable(id: AmbienceId, volume: number) {
    if (this.disposed || this.layers.has(id)) return;
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return;
    // Safari and Chrome both hand back a suspended context until a gesture.
    if (ctx.state === "suspended") await ctx.resume();

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.master);

    const layer: Layer = { gain, nodes: [], timers: [] };
    this.layers.set(id, layer);
    this.build(id, ctx, layer);

    gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + FADE);
  }

  disable(id: AmbienceId) {
    const layer = this.layers.get(id);
    if (!layer || !this.ctx) return;
    this.layers.delete(id);
    const now = this.ctx.currentTime;
    layer.gain.gain.cancelScheduledValues(now);
    layer.gain.gain.setValueAtTime(layer.gain.gain.value, now);
    layer.gain.gain.linearRampToValueAtTime(0.0001, now + FADE);
    // Let the fade finish before the nodes go, or it clicks.
    window.setTimeout(() => this.destroy(layer), FADE * 1000 + 80);
  }

  setLayerVolume(id: AmbienceId, volume: number) {
    const layer = this.layers.get(id);
    if (!layer || !this.ctx) return;
    layer.gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
  }

  setMasterVolume(volume: number) {
    this.masterVolume = Math.min(1, Math.max(0, volume));
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(
        this.masterVolume * MAX_GAIN,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  stopAll() {
    for (const id of [...this.layers.keys()]) this.disable(id);
  }

  dispose() {
    this.disposed = true;
    for (const layer of this.layers.values()) this.destroy(layer);
    this.layers.clear();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }

  private destroy(layer: Layer) {
    for (const timer of layer.timers) clearTimeout(timer);
    for (const node of layer.nodes) {
      try {
        node.stop();
      } catch {
        // Already stopped; nothing to do.
      }
      node.disconnect();
    }
    layer.gain.disconnect();
  }

  /** Schedule a repeating randomised event, tracked so it can be cancelled. */
  private repeat(layer: Layer, delay: () => number, fire: () => void) {
    const tick = () => {
      if (this.disposed) return;
      fire();
      layer.timers.push(setTimeout(tick, delay()));
    };
    layer.timers.push(setTimeout(tick, delay()));
  }

  private loop(ctx: AudioContext, buffer: AudioBuffer) {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }

  /** A slow sine modulating a filter or gain, for gusts and swells. */
  private lfo(ctx: AudioContext, layer: Layer, frequency: number, depth: number, offset: number) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency;
    const gain = ctx.createGain();
    gain.gain.value = depth;
    osc.connect(gain);
    const constant = ctx.createConstantSource();
    constant.offset.value = offset;
    osc.start();
    constant.start();
    layer.nodes.push(osc, constant);
    return (target: AudioParam) => {
      gain.connect(target);
      constant.connect(target);
    };
  }

  /** One short filtered noise burst - a droplet, a crackle, a tick. */
  private burst(
    ctx: AudioContext,
    out: AudioNode,
    o: { type: BiquadFilterType; frequency: number; q: number; gain: number; decay: number }
  ) {
    const source = ctx.createBufferSource();
    source.buffer = this.white!;
    const filter = ctx.createBiquadFilter();
    filter.type = o.type;
    filter.frequency.value = o.frequency;
    filter.Q.value = o.q;
    const env = ctx.createGain();
    const now = ctx.currentTime;
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(o.gain, now + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, now + o.decay);

    source.connect(filter).connect(env).connect(out);
    // Random offset so successive bursts are never identical.
    source.start(now, Math.random() * (this.white!.duration - o.decay - 0.02), o.decay + 0.02);
    source.onended = () => {
      source.disconnect();
      filter.disconnect();
      env.disconnect();
    };
  }

  /** A struck, ringing tone - bells and bowls. */
  private bell(
    ctx: AudioContext,
    out: AudioNode,
    o: { frequency: number; gain: number; decay: number }
  ) {
    const now = ctx.currentTime;
    // A couple of inharmonic partials is what separates a bell from a beep.
    [1, 2.76, 5.4].forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = o.frequency * ratio;
      const env = ctx.createGain();
      const level = o.gain / (index + 1.6);
      const decay = o.decay / (index * 0.6 + 1);
      env.gain.setValueAtTime(0, now);
      env.gain.linearRampToValueAtTime(level, now + 0.006);
      env.gain.exponentialRampToValueAtTime(0.0001, now + decay);
      osc.connect(env).connect(out);
      osc.start(now);
      osc.stop(now + decay + 0.05);
      osc.onended = () => {
        osc.disconnect();
        env.disconnect();
      };
    });
  }

  private build(id: AmbienceId, ctx: AudioContext, layer: Layer) {
    const out = layer.gain;

    switch (id) {
      case "rain": {
        const src = this.loop(ctx, this.white!);
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 420;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 5200;
        const body = ctx.createGain();
        body.gain.value = 0.55;
        src.connect(hp).connect(lp).connect(body).connect(out);
        src.start();
        layer.nodes.push(src);
        this.repeat(layer, () => 40 + Math.random() * 200, () =>
          this.burst(ctx, out, {
            type: "bandpass",
            frequency: 1800 + Math.random() * 4200,
            q: 12,
            gain: 0.05 + Math.random() * 0.07,
            decay: 0.04 + Math.random() * 0.05,
          })
        );
        return;
      }

      // Softer and darker than open rain, with a wider, slower spatter.
      case "leaves": {
        const src = this.loop(ctx, this.white!);
        const bp = ctx.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1300;
        bp.Q.value = 0.6;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 3200;
        const body = ctx.createGain();
        body.gain.value = 0.7;
        src.connect(bp).connect(lp).connect(body).connect(out);
        src.start();
        layer.nodes.push(src);
        this.repeat(layer, () => 60 + Math.random() * 320, () =>
          this.burst(ctx, out, {
            type: "bandpass",
            frequency: 700 + Math.random() * 1800,
            q: 6,
            gain: 0.06 + Math.random() * 0.09,
            decay: 0.05 + Math.random() * 0.08,
          })
        );
        return;
      }

      // Distant rumble: a long, very low swell every twenty seconds or so.
      case "thunder": {
        this.repeat(layer, () => 9000 + Math.random() * 26000, () => {
          const src = ctx.createBufferSource();
          src.buffer = this.brown!;
          const lp = ctx.createBiquadFilter();
          lp.type = "lowpass";
          const now = ctx.currentTime;
          const length = 2.5 + Math.random() * 3;
          lp.frequency.setValueAtTime(180, now);
          lp.frequency.exponentialRampToValueAtTime(55, now + length);
          const env = ctx.createGain();
          env.gain.setValueAtTime(0, now);
          env.gain.linearRampToValueAtTime(0.55 + Math.random() * 0.35, now + 0.35);
          env.gain.exponentialRampToValueAtTime(0.0001, now + length);
          src.connect(lp).connect(env).connect(out);
          src.start(now, Math.random() * 1.5, length + 0.1);
          src.onended = () => {
            src.disconnect();
            lp.disconnect();
            env.disconnect();
          };
        });
        return;
      }

      case "waves": {
        const src = this.loop(ctx, this.brown!);
        const hp = ctx.createBiquadFilter();
        hp.type = "highpass";
        hp.frequency.value = 180;
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 900;
        const level = ctx.createGain();
        level.gain.value = 0.4;
        src.connect(hp).connect(lp).connect(level).connect(out);
        src.start();
        layer.nodes.push(src);
        this.lfo(ctx, layer, 0.055, 0.34, 0.5)(level.gain);
        this.lfo(ctx, layer, 0.055, 700, 1100)(lp.frequency);
        return;
      }

      case "fire": {
        const src = this.loop(ctx, this.brown!);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 320;
        const body = ctx.createGain();
        body.gain.value = 0.5;
        src.connect(lp).connect(body).connect(out);
        src.start();
        layer.nodes.push(src);
        // Crackles arrive in little clusters, not evenly.
        this.repeat(layer, () => 120 + Math.random() * 900, () => {
          const count = 1 + Math.floor(Math.random() * 3);
          for (let i = 0; i < count; i += 1) {
            layer.timers.push(
              setTimeout(() => {
                if (this.disposed) return;
                this.burst(ctx, out, {
                  type: "highpass",
                  frequency: 1600 + Math.random() * 2600,
                  q: 1,
                  gain: 0.06 + Math.random() * 0.12,
                  decay: 0.02 + Math.random() * 0.05,
                });
              }, i * (18 + Math.random() * 45))
            );
          }
        });
        return;
      }

      case "wind": {
        const src = this.loop(ctx, this.brown!);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 480;
        lp.Q.value = 2.5;
        const level = ctx.createGain();
        level.gain.value = 0.5;
        src.connect(lp).connect(level).connect(out);
        src.start();
        layer.nodes.push(src);
        this.lfo(ctx, layer, 0.06, 320, 520)(lp.frequency);
        this.lfo(ctx, layer, 0.09, 0.28, 0.55)(level.gain);
        return;
      }

      // Chirps come in short bursts of pulses, which is what makes them read as
      // an insect rather than a beep. Driven by an oscillator, not filtered
      // noise: the narrow band a cricket occupies would leave almost no energy
      // once a Q that high was applied to noise.
      case "crickets": {
        this.repeat(layer, () => 700 + Math.random() * 1400, () => {
          const pulses = 3 + Math.floor(Math.random() * 3);
          const frequency = 4200 + Math.random() * 900;
          for (let i = 0; i < pulses; i += 1) {
            layer.timers.push(
              setTimeout(() => {
                if (this.disposed) return;
                const osc = ctx.createOscillator();
                osc.type = "triangle";
                osc.frequency.value = frequency;
                const env = ctx.createGain();
                const now = ctx.currentTime;
                env.gain.setValueAtTime(0, now);
                env.gain.linearRampToValueAtTime(0.3, now + 0.005);
                env.gain.exponentialRampToValueAtTime(0.0001, now + 0.032);
                osc.connect(env).connect(out);
                osc.start(now);
                osc.stop(now + 0.05);
                osc.onended = () => {
                  osc.disconnect();
                  env.disconnect();
                };
              }, i * 55)
            );
          }
        });
        return;
      }

      case "chimes": {
        // A pentatonic set, so any order of strikes stays consonant.
        const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
        this.repeat(layer, () => 1200 + Math.random() * 4200, () => {
          const count = 1 + Math.floor(Math.random() * 3);
          for (let i = 0; i < count; i += 1) {
            layer.timers.push(
              setTimeout(() => {
                if (this.disposed) return;
                this.bell(ctx, out, {
                  frequency: notes[Math.floor(Math.random() * notes.length)],
                  gain: 0.12 + Math.random() * 0.1,
                  decay: 1.8 + Math.random() * 2.2,
                });
              }, i * (90 + Math.random() * 260))
            );
          }
        });
        return;
      }

      // Two close partials beating against each other is the whole character
      // of a bowl: the slow wobble is the interference, not an LFO.
      case "bowl": {
        [196, 196.6, 392.4, 588].forEach((frequency, index) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = frequency;
          const gain = ctx.createGain();
          gain.gain.value = 0.3 / (index + 1);
          osc.connect(gain).connect(out);
          osc.start();
          layer.nodes.push(osc);
        });
        const shimmer = ctx.createGain();
        shimmer.gain.value = 1;
        this.lfo(ctx, layer, 0.07, 0.25, 0.75)(shimmer.gain);
        return;
      }

      case "clock": {
        let tock = false;
        this.repeat(layer, () => 1000, () => {
          tock = !tock;
          this.burst(ctx, out, {
            type: "bandpass",
            // Tick and tock differ slightly, as a real escapement does.
            frequency: tock ? 2600 : 3100,
            q: 4,
            gain: 0.9,
            decay: 0.014,
          });
        });
        return;
      }

      // Motor hum plus a shallow amplitude wobble at blade-pass rate.
      case "fan": {
        const hum = ctx.createOscillator();
        hum.type = "sine";
        hum.frequency.value = 62;
        const humGain = ctx.createGain();
        humGain.gain.value = 0.16;
        hum.connect(humGain).connect(out);
        hum.start();

        const air = this.loop(ctx, this.brown!);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 420;
        const level = ctx.createGain();
        level.gain.value = 0.5;
        air.connect(lp).connect(level).connect(out);
        air.start();
        layer.nodes.push(hum, air);
        this.lfo(ctx, layer, 10.5, 0.06, 0.5)(level.gain);
        return;
      }

      case "underwater": {
        const src = this.loop(ctx, this.brown!);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 260;
        const level = ctx.createGain();
        level.gain.value = 0.7;
        src.connect(lp).connect(level).connect(out);
        src.start();
        layer.nodes.push(src);
        this.lfo(ctx, layer, 0.08, 0.2, 0.7)(level.gain);
        // Bubbles: a quick upward chirp, which is how a rising bubble reads.
        this.repeat(layer, () => 900 + Math.random() * 3500, () => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          const now = ctx.currentTime;
          const start = 320 + Math.random() * 500;
          osc.frequency.setValueAtTime(start, now);
          osc.frequency.exponentialRampToValueAtTime(start * 2.4, now + 0.09);
          const env = ctx.createGain();
          env.gain.setValueAtTime(0, now);
          env.gain.linearRampToValueAtTime(0.16, now + 0.01);
          env.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);
          osc.connect(env).connect(out);
          osc.start(now);
          osc.stop(now + 0.14);
          osc.onended = () => {
            osc.disconnect();
            env.disconnect();
          };
        });
        return;
      }

      case "white": {
        const src = this.loop(ctx, this.white!);
        const lp = ctx.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 7800;
        const level = ctx.createGain();
        level.gain.value = 0.32;
        src.connect(lp).connect(level).connect(out);
        src.start();
        layer.nodes.push(src);
        return;
      }
    }
  }
}
