"""Assemble selected, verified Day 5 takes into a 67-second timeline with measured words.
Lines l07 and l16 are dropped for length (flagged as cut candidates in NASKAH.md)."""
import json, pathlib, subprocess, wave
import numpy as np

HERE=pathlib.Path(__file__).resolve().parent
audit={r['id']:r for r in json.loads((HERE/'voice/take-audit.json').read_text())}
SR=48000
DUR=67
buffer=np.zeros(DUR*SR,dtype=np.float32)
lines=[];script=[];selections=[]
groups=[(['l01','l02','l03'],0,8.3),(['l04','l05'],8.3,17.6),(['l06','l08','l09','l10','l11','l12'],17.6,37.0),
        (['l13','l14','l15'],37.0,48.5),(['l17','l18','l19','l20','l21','l22'],48.5,67)]
beats={'l10':0.35,'l11':0.3,'l13':0.25,'l17':0.2}
trim='silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse'
for ids,start,end in groups:
    rows=[audit[i] for i in ids]
    gaps=[beats.get(i,0.1) for i in ids]
    lead=0.2;tail=1.8 if ids[-1]=='l22' else 0.1
    selected=[row['takes'][row['selected']] for row in rows]
    total=sum(t['trimmed_duration'] for t in selected)
    available=(end-start)-lead-tail-sum(gaps[:-1])
    speed=max(1.0,total/available)
    assert speed<1.3, f'Unnatural speed {speed}: revise assembly'
    t=start+lead
    for offset,(row,take) in enumerate(zip(rows,selected)):
        dest=HERE/'voice'/f"{row['id']}.mp3"
        af=f'{trim},atempo={speed:.8f}'
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(HERE/'voice'/take['file']),'-af',af,'-ac','1','-ar',str(SR),'-q:a','2',str(dest)],check=True)
        raw=subprocess.run(['ffmpeg','-v','error','-i',str(HERE/'voice'/take['file']),'-af',af,'-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout
        pcm=np.frombuffer(raw,dtype=np.float32);dur=len(pcm)/SR
        pos=round(t*SR);buffer[pos:pos+len(pcm)]+=pcm
        text=row['text'].replace('gw','gue').replace('Gw','Gue')
        words=[{'w':w['w'],'t0':round(t+w['t0']/speed,3),'t1':round(min(t+dur,t+w['t1']/speed),3)} for w in take['words'] if w['t0']/speed<dur]
        lines.append({'id':row['id'],'text':text,'t0':round(t,3),'t1':round(t+dur,3),'words':words,'take':f"voice/{row['id']}.mp3"})
        script.append({'id':row['id'],'text':text,'file':f"{row['id']}.mp3",'start':round(t,3),'after':gaps[offset]})
        selections.append({'id':row['id'],'source':take['file'],'heard':take['heard'],'score':take['score'],'speed':round(speed,6),'duration':round(dur,4)})
        t+=dur+gaps[offset]
    assert t-gaps[-1]<end, f'Group overrun {t}, {end}'
    print(f'group {ids[0]}-{ids[-1]}: tempo {speed:.3f}, last voice {t-gaps[-1]:.3f}, window ends {end}',flush=True)
with wave.open(str(HERE/'voice/voice.wav'),'wb') as f:
    f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes((np.clip(buffer,-1,1)*32767).astype(np.int16).tobytes())
voice={'duration':DUR,'lead':0.2,'tail':round(DUR-lines[-1]['t1'],3),'lines':lines}
(HERE/'voice.json').write_text(json.dumps(voice,ensure_ascii=False,indent=1))
(HERE/'voice/script.json').write_text(json.dumps({'duration':DUR,'assembly':'python3 pieces/warung-day5/build_voice.py','lines':script},ensure_ascii=False,indent=2))
(HERE/'voice/selection.json').write_text(json.dumps(selections,ensure_ascii=False,indent=2))
(HERE/'../../remotion/warung-netizen/src/data/voice-day5.json').write_text(json.dumps(voice,ensure_ascii=False,indent=1))
