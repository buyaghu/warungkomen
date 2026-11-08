"""Assemble selected, verified takes into a 95-second timeline with measured words."""
import json, pathlib, subprocess, wave
import numpy as np

HERE=pathlib.Path(__file__).resolve().parent
audit=json.loads((HERE/'voice/take-audit.json').read_text())
assert len(audit)==30, 'Finish take audit before assembly'
# Critical count independently verified with Scribe; prefer the clear "geprek" take.
audit[2]['selected']=1
audit[25]['selected']=0
SR=48000
buffer=np.zeros(95*SR,dtype=np.float32)
lines=[];script=[];selections=[]
groups=[(0,5,0,15),(5,10,15,30),(10,19,30,58),(19,25,58,77),(25,30,77,95)]
trim='silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse'
for first,last,start,end in groups:
    rows=audit[first:last]
    # Small air between lines, larger beats for the garlic, noodle pull and returned bowl.
    gaps=[{9:0.65,15:0.38,16:0.6,17:0.4,21:0.5,22:0.35}.get(i,0.16) for i in range(first,last)]
    lead=0.2;tail=1.8 if last==30 else 0.15
    selected=[row['takes'][row['selected']] for row in rows]
    total=sum(t['trimmed_duration'] for t in selected)
    available=(end-start)-lead-tail-sum(gaps[:-1])
    speed=max(1.0,total/available)
    assert speed<1.4, f'Unnatural speed {speed}: revise assembly'
    # If the takes are shorter, give the remaining time to visual acting at group end.
    t=start+lead
    for offset,(row,take) in enumerate(zip(rows,selected)):
        dest=HERE/'voice'/f"{row['id']}.mp3"
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(HERE/'voice'/take['file']),'-af',f'{trim},atempo={speed:.8f}','-ac','1','-ar',str(SR),'-q:a','2',str(dest)],check=True)
        raw=subprocess.run(['ffmpeg','-v','error','-i',str(HERE/'voice'/take['file']),'-af',f'{trim},atempo={speed:.8f}','-ac','1','-ar',str(SR),'-f','f32le','-'],capture_output=True,check=True).stdout
        pcm=np.frombuffer(raw,dtype=np.float32);dur=len(pcm)/SR
        pos=round(t*SR);buffer[pos:pos+len(pcm)]+=pcm
        text=row['text'].replace('gw','gue')
        words=[{'w':w['w'],'t0':round(t+w['t0']/speed,3),'t1':round(min(t+dur,t+w['t1']/speed),3)} for w in take['words'] if w['t0']/speed<dur]
        lines.append({'id':row['id'],'text':text,'t0':round(t,3),'t1':round(t+dur,3),'words':words,'take':f"voice/{row['id']}.mp3"})
        script.append({'id':row['id'],'text':text,'file':f"{row['id']}.mp3",'start':round(t,3),'after':gaps[offset]})
        selections.append({'id':row['id'],'source':take['file'],'heard':take['heard'],'score':take['score'],'speed':round(speed,6),'duration':round(dur,4)})
        t+=dur+gaps[offset]
    assert t-gaps[-1]<end, f'Group overrun {t}, {end}'
    print(f'group {first+1}-{last}: tempo {speed:.3f}, last voice {t-gaps[-1]:.3f}, window ends {end}',flush=True)
with wave.open(str(HERE/'voice/voice.wav'),'wb') as f:
    f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes((np.clip(buffer,-1,1)*32767).astype(np.int16).tobytes())
voice={'duration':95,'lead':0.2,'tail':round(95-lines[-1]['t1'],3),'lines':lines}
(HERE/'voice.json').write_text(json.dumps(voice,ensure_ascii=False,indent=1))
(HERE/'voice/script.json').write_text(json.dumps({'duration':95,'assembly':'python3 pieces/warung-day3/build_voice.py','lines':script},ensure_ascii=False,indent=2))
(HERE/'voice/selection.json').write_text(json.dumps(selections,ensure_ascii=False,indent=2))
target=HERE/'../../remotion/warung-netizen/src/data/voice-day3.json'
target.write_text(json.dumps(voice,ensure_ascii=False,indent=1))
