#!/usr/bin/env python3
"""Day 3 audio mix: Mang Juned's voice (voice/voice.wav) + a synthesized 120 BPM score + sfx.
   usage: python3 pieces/warung-day3/mix.py   ->  pieces/warung-day3/mix.wav (48 kHz stereo)
Everything is generated here (no samples), so the mix is reproducible. Cues come from voice.json."""
import json, os, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SR = 48000
V = json.load(open(os.path.join(HERE, 'voice.json')))
DUR = 95.0
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
REV, END = 0.2, 92.8
breakdown = (0.0, REV)  # drumroll before the reveal: groove drops out
for b in range(int(DUR / BEAT)):
    t = b * BEAT
    if t >= END + 0.5: break
    bar, beat = divmod(b, 4)
    root, ch = prog[(bar // 2) % 4] if t < 63.0 or t >= 71.0 else prog[[1, 3][(bar // 2) % 2]]  # protest: minor-ish turn
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
# end sting
for k, m in enumerate([72, 76, 79, 84]):
    add(mus, END + k * 0.12, tone(hz(m), 0.6, 'tri') * env(int(0.6 * SR), 0.005, 0.3), 0.22)
add(mus, END + 0.48, kick, 0.7)

# ---------------- Day 3 action sound effects on the measured voice clock ----------------
sfx = np.zeros(N, np.float32)
def cue(n): return V['lines'][n-1]['t0']
def effect(f, dur=0.18, decay=0.06):
    return tone(f, dur) * env(int(dur * SR), 0.002, decay)
POP = effect(np.geomspace(500, 1300, int(.09 * SR)), .09, .04)
ding = sum(effect(f, 1.1, .4) for f in [1568, 2350, 3136]) / 3
boing = effect(350 + 160*np.sin(np.linspace(0, 26, int(.6*SR)))*np.linspace(1,0,int(.6*SR)), .6, .28)
for n in [1,3,4,7,10,12,14,16,17,19,23,25,26,29,30]:add(sfx,cue(n),POP,.22)
for n in [6,8,11,15,20,26]:
    add(sfx,max(0,cue(n)-.15),bp_fast(noise(.3),500,4000)*np.sin(np.linspace(0,np.pi,int(.3*SR)))**2,.10)
add(sfx,cue(1),ding,.22)
add(sfx,cue(10)+.4,boing,.25)
# Stir-fry and bubbling stay beneath speech.
for start,end,lo,hi in [(cue(11),cue(15),2000,8000),(cue(15),cue(19),400,1800)]:
    d=end-start
    snd=bp_fast(noise(d),lo,hi)*np.minimum(1,np.arange(int(d*SR))/SR/.2)*np.minimum(1,np.arange(int(d*SR))[::-1]/SR/.3)
    add(sfx,start,snd,.025)
# A short synthesized meow answering the cat joke.
d=.6;u=np.linspace(0,1,int(d*SR));f=600+300*np.sin(u*np.pi)
add(sfx,cue(14)+1.7,tone(f,d)*np.sin(u*np.pi)**2,.08)
# Noodle stretch rises into a boing, then lands in the bowl.
add(sfx,cue(16),effect(np.linspace(180,700,int(1.2*SR)),1.2,.7),.06)
add(sfx,cue(17),boing,.2)
add(sfx,cue(19),ding,.2)
# Spoon clink and dramatic silence while Juned thinks the bowl was returned.
add(sfx,cue(21),effect(2100,.22,.05),.16)
mus[int(cue(21)*SR):int(cue(23)*SR)] *= .16
add(sfx,cue(23),ding,.25)
for dt in [0,.26,.52]:add(sfx,cue(25)+dt,POP,.18)
for dt in [.1,.5,.9]:add(sfx,cue(27)+dt,POP,.15)

# ---------------- voice and sidechain music ducking ----------------
voice=read_wav(os.path.join(HERE,'voice','voice.wav'))
vo=np.zeros(N,np.float32);vo[:min(N,len(voice))]=voice[:N]
lvl=np.sqrt(np.convolve(vo**2,np.ones(1200)/1200,mode='same'))
# Smooth control at 100 Hz rather than looping over millions of samples.
gate=(lvl[::480]>.008).astype(np.float32)
duck=np.repeat(1-.72*lp(gate,.3),480)[:N]
bed=mus*duck*.36+sfx*.8
bed[int((DUR-1.1)*SR):]*=np.linspace(1,0,N-int((DUR-1.1)*SR))
st=np.stack([vo+bed*.95,vo+bed],1)
st/=max(1.,np.abs(st).max()/.95)
with wave.open(os.path.join(HERE,'mix.wav'),'w') as f:
    f.setnchannels(2);f.setsampwidth(2);f.setframerate(SR);f.writeframes((st*32767).astype(np.int16).tobytes())
print('mix.wav',DUR,'s')

