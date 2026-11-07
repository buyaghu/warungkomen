#!/usr/bin/env python3
"""Day 2 audio mix: Mang Juned's voice (voice/voice.wav) + a synthesized 120 BPM score + sfx.
   usage: python3 pieces/warung-day2/mix.py   ->  pieces/warung-day2/mix.wav (48 kHz stereo)
Everything is generated here (no samples), so the mix is reproducible. Cues come from voice.json."""
import json, os, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
V = json.load(open(os.path.join(HERE, 'voice.json')))
DUR = 62.0
N = int(DUR * SR)
rng = np.random.default_rng(7)


def W(line, word, n=0):
    L = next(l for l in V['lines'] if l['id'] == line)
    c = lambda s: ''.join(ch for ch in s.lower() if ch.isalnum())
    hits = [w for w in L['words'] if c(w['w']) == c(word)]
    return (hits[n] if n < len(hits) else hits[0])['t0']


def read_wav(p):
    with wave.open(p) as f:
        x = np.frombuffer(f.readframes(f.getnframes()), dtype=np.int16).astype(np.float32) / 32768
    return x


def add(buf, t, x, g=1.0):
    i = int(t * SR)
    if i >= len(buf): return
    x = x[: len(buf) - i]
    buf[i:i + len(x)] += x * g


def env(n, a=0.002, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def tone(f, dur, shape='sine'):
    t = np.arange(int(dur * SR)) / SR
    ph = 2 * np.pi * np.cumsum(np.broadcast_to(f, t.shape)) / SR if np.ndim(f) else 2 * np.pi * f * t
    if shape == 'sine': return np.sin(ph)
    if shape == 'tri': return 2 / np.pi * np.arcsin(np.sin(ph))
    if shape == 'saw': return 2 * ((ph / (2 * np.pi)) % 1) - 1
    return np.sign(np.sin(ph))


def noise(dur): return rng.standard_normal(int(dur * SR)).astype(np.float32)


def lp(x, a):  # one-pole low-pass, a in (0,1): smaller = darker
    y = np.empty_like(x); s = 0.0
    for i in range(len(x)):
        s += a * (x[i] - s); y[i] = s
    return y


def lp_fast(x, cutoff):  # FFT brick-ish low-pass for long noise
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / cutoff) ** 4)
    return np.fft.irfft(X, len(x)).astype(np.float32)


def bp_fast(x, lo, hi):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (lo / np.maximum(f, 1)) ** 4)) * (1 / (1 + (f / hi) ** 4))
    return np.fft.irfft(X, len(x)).astype(np.float32)


def pluck(f, dur, damp=0.996):  # Karplus-Strong
    n = int(dur * SR); p = max(2, int(SR / f))
    buf = rng.uniform(-1, 1, p).astype(np.float32); out = np.empty(n, np.float32)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = damp * 0.5 * (buf[i % p] + buf[(i + 1) % p])
    return out


# ---------------- score: 120 BPM, I-vi-IV-V in C, kendang-ish groove ----------------
mus = np.zeros(N, np.float32)
BEAT = 0.5
hz = lambda m: 440 * 2 ** ((m - 69) / 12)
prog = [(48, [60, 64, 67]), (45, [57, 60, 64]), (41, [57, 60, 65]), (43, [59, 62, 67])]  # C Am F G
kick = tone(np.linspace(140, 45, int(0.25 * SR)), 0.25) * env(int(0.25 * SR), 0.001, 0.09)
tak = bp_fast(noise(0.12), 900, 4000) * env(int(0.12 * SR), 0.001, 0.035) + 0.6 * tone(np.linspace(420, 260, int(0.12 * SR)), 0.12) * env(int(0.12 * SR), 0.001, 0.05)
dung = tone(np.linspace(180, 110, int(0.3 * SR)), 0.3) * env(int(0.3 * SR), 0.002, 0.12)
shk = bp_fast(noise(0.05), 5000, 12000) * env(int(0.05 * SR), 0.001, 0.015)
plk_cache = {}
REV, END = W('menang', 'ayam'), 59.9
breakdown = (7.3, REV)  # drumroll before the reveal: groove drops out
for b in range(int(DUR / BEAT)):
    t = b * BEAT
    if t >= END + 0.5: break
    bar, beat = divmod(b, 4)
    root, ch = prog[(bar // 2) % 4] if t < 46.0 or t >= 52.75 else prog[[1, 3][(bar // 2) % 2]]  # protest: minor-ish turn
    if breakdown[0] <= t < breakdown[1]:
        continue
    add(mus, t, kick, 0.55 if beat in (0, 2) else 0.0)
    add(mus, t + 0.25, tak, 0.35)
    if beat == 3: add(mus, t + 0.375, dung, 0.4)
    for s in range(4): add(mus, t + s * 0.125, shk, 0.12 if s % 2 else 0.07)
    # bass: root on the beat, fifth on the and-of-2
    bn = root if beat != 2 else root + 7
    add(mus, t, pluck(hz(bn), 0.45, 0.993) * 0.9, 0.35)
    # off-beat chord stabs (the "chk" of a cheerful street band)
    key = tuple(ch)
    if key not in plk_cache:
        plk_cache[key] = sum(pluck(hz(m), 0.3, 0.99) for m in ch) / 3
    add(mus, t + 0.25, plk_cache[key], 0.32)
    # a little melody every other bar
    if bar % 2 == 0 and beat in (0, 1, 3):
        m = ch[[0, 2, 1][[0, 1, 3].index(beat)]] + 12
        add(mus, t, tone(hz(m), 0.22, 'tri') * env(int(0.22 * SR), 0.005, 0.12), 0.12)
# drumroll into the reveal
for i, t in enumerate(np.arange(breakdown[0], REV - 0.02, 1 / 16)):
    add(mus, t, tak, 0.12 + 0.35 * (t - breakdown[0]) / (REV - breakdown[0]))
# end sting
for k, m in enumerate([72, 76, 79, 84]):
    add(mus, END + k * 0.12, tone(hz(m), 0.6, 'tri') * env(int(0.6 * SR), 0.005, 0.3), 0.22)
add(mus, END + 0.48, kick, 0.7)

# ---------------- sfx ----------------
sfx = np.zeros(N, np.float32)
POP = tone(np.geomspace(500, 1300, int(0.09 * SR)), 0.09) * env(int(0.09 * SR), 0.001, 0.04)
def whoosh(d=0.35):
    x = bp_fast(noise(d), 300, 3000) * np.sin(np.linspace(0, np.pi, int(d * SR))) ** 2
    return x
crash = bp_fast(noise(1.6), 3000, 14000) * env(int(1.6 * SR), 0.002, 0.5)
boom = tone(np.linspace(90, 35, int(0.8 * SR)), 0.8) * env(int(0.8 * SR), 0.002, 0.3)
thud = tone(np.linspace(120, 50, int(0.25 * SR)), 0.25) * env(int(0.25 * SR), 0.001, 0.08) + lp_fast(noise(0.25), 800) * env(int(0.25 * SR), 0.001, 0.04)
crunch = bp_fast(noise(0.25), 1500, 8000) * env(int(0.25 * SR), 0.001, 0.06)
ding = sum(tone(f, 1.5) * env(int(1.5 * SR), 0.001, d) for f, d in [(1568, 0.6), (2350, 0.4), (3136, 0.25)]) / 3
boing = tone(400 + 160 * np.sin(np.linspace(0, 30, int(0.6 * SR))) * np.linspace(1, 0, int(0.6 * SR)), 0.6) * env(int(0.6 * SR), 0.002, 0.25)
chime = sum(tone(hz(m), 0.8) * env(int(0.8 * SR), 0.002, 0.3) for m in [84, 88, 91, 96]) / 4

shots = [7.25, 9.75, 13.0, 16.25, 19.5, 22.25, 25.25, 28.75, 32.25, 35.75, 39.25, 42.25, 46.0, 52.75]
for s in shots: add(sfx, s - 0.15, whoosh(), 0.10)
pops = [0.6, 1.0, 1.5, 2.0, 2.5, 3.0, W('pelit', 'pelit'), REV + 0.35, 9.85, W('sawit', 'sawit', 1) + 0.15, 13.05, W('bakso', 'tepung'),
        W('bakso', 'rendang') + 0.3, 16.45, W('ayaaya', 'aya-aya'), W('belanja', 'modal'), W('goreng', 'kriuk'), W('goreng', 'ulek'),
        W('goreng', 'cabe'), W('pedes', 'waduh'), W('pedes', 'pedesnya'), W('geprek', 'jadi'), W('dateng', 'beneran'),
        W('terharu', 'hatur'), W('protes', 'nasgor'), W('protes', 'mie'), W('disebut', 'disebut'), W('disebut', 'iye'),
        W('cta1', 'adu'), W('cta1', 'komen'), W('cta2', 'like')]
for p in pops: add(sfx, p, POP, 0.30)
add(sfx, REV, crash, 0.30); add(sfx, REV, boom, 0.55)
add(sfx, W('sawit', 'sawit', 1), boing, 0.25)
# rendang rolls in: low rumble
rd = W('bakso', 'rendang')
add(sfx, rd - 0.3, lp_fast(noise(0.7), 250) * np.sin(np.linspace(0, np.pi, int(0.7 * SR))), 0.5)
# receipt printer
rp = W('borong', 'borong')
add(sfx, rp, bp_fast(noise(1.3), 1500, 5000) * (0.6 + 0.4 * np.sign(np.sin(np.linspace(0, 160, int(1.3 * SR))))), 0.05)
add(sfx, W('borong', 'bayar'), thud, 0.6)
# frying sizzle + ulek thumps
add(sfx, 25.25, bp_fast(noise(3.5), 2000, 9000) * (0.7 + 0.3 * rng.random(int(3.5 * SR))) * np.minimum(1, np.linspace(0, 8, int(3.5 * SR))) * np.minimum(1, np.linspace(8, 0, int(3.5 * SR))), 0.06)
for t in np.arange(W('goreng', 'ulek'), 28.7, 0.314): add(sfx, t, thud, 0.18)
# geprek! geprek!
for k in (W('geprek', 'geprek'), W('geprek', 'geprek', 1)):
    add(sfx, k, thud, 0.9); add(sfx, k, crunch, 0.35); add(sfx, k, boom, 0.3)
add(sfx, W('geprek', 'nah'), chime, 0.35)
# the customer arrives: footsteps, then the bell
ad = W('dateng', 'ada')
for t in np.arange(ad - 0.2, ad + 0.7, 0.26): add(sfx, t, lp_fast(noise(0.08), 900) * env(int(0.08 * SR), 0.001, 0.02), 0.3)
add(sfx, W('dateng', 'beneran'), ding, 0.35)
# pencil scribble, stamp LUNAS
nm = W('bon', 'namanya')
for t in np.arange(nm, nm + 1.1, 0.09): add(sfx, t, bp_fast(noise(0.06), 2500, 7000) * env(int(0.06 * SR), 0.005, 0.03), 0.10)
add(sfx, W('bon', 'bon'), thud, 0.7)
# the customer counter ticks 2..5
for k in range(4): add(sfx, 43.2 + 0.5 * (k + 1) - 0.25, POP * 0.8, 0.3)
# the protest: crowd murmur
cr = bp_fast(noise(6.3), 200, 1200) * (0.6 + 0.4 * np.sin(np.linspace(0, 40, int(6.3 * SR))) ** 2)
add(sfx, 46.2, cr * np.minimum(1, np.linspace(0, 6, int(6.3 * SR))) * np.minimum(1, np.linspace(6, 0, int(6.3 * SR))), 0.12)
# BURUAN!
add(sfx, W('cta2', 'buruan'), crash, 0.2); add(sfx, W('cta2', 'buruan'), POP, 0.4)

# ---------------- voice + ducking ----------------
voice = read_wav(os.path.join(HERE, 'voice', 'voice.wav'))
vo = np.zeros(N, np.float32); vo[:min(N, len(voice))] = voice[:N]
# sidechain: music dips ~9 dB under the voice, smooth attack/release
lvl = np.sqrt(np.convolve(vo ** 2, np.ones(2400) / 2400, mode='same'))
gate = (lvl > 0.01).astype(np.float32)
duck = 1 - 0.65 * lp(np.repeat(gate[::480], 480)[:N], 0.25)
mix_m = mus * duck * 0.55 + sfx * 0.9
# fade the music out over the last second
mix_m[int((DUR - 1.2) * SR):] *= np.linspace(1, 0, N - int((DUR - 1.2) * SR))
L = vo * 1.0 + mix_m * 0.95
R = vo * 1.0 + mix_m * 1.0
st = np.stack([L, R], 1)
st /= max(1.0, np.abs(st).max() / 0.95)
out = (st * 32767).astype(np.int16)
with wave.open(os.path.join(HERE, 'mix.wav'), 'w') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(out.tobytes())
print('mix.wav', DUR, 's')
