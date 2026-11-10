"""Assemble selected, verified takes into a 65-second timeline with measured words."""
import json, pathlib, subprocess, wave
import numpy as np

HERE=pathlib.Path(__file__).resolve().parent
audit=json.loads((HERE/'voice/take-audit.json').read_text())
assert len(audit)==21, 'Finish take audit before assembly'
SR=48000
DUR=65
buffer=np.zeros(DUR*SR,dtype=np.float32)
lines=[];script=[];selections=[]
groups=[(0,3,0,8.8),(3,8,8.8,24.6),(8,14,24.6,44.2),(14,17,44.2,53.4),(17,21,53.4,65)]
trim='silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse'
for first,last,start,end in groups:
    rows=audit[first:last]
    # Small air between lines, larger beats for the garlic, noodle pull and returned bowl.
    gaps=[{10:0.35,13:0.3,16:0.3}.get(i,0.1) for i in range(first,last)]
    lead=0.2;tail=1.0 if last==21 else 0.1
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
voice={'duration':DUR,'lead':0.2,'tail':round(DUR-lines[-1]['t1'],3),'lines':lines}
(HERE/'voice.json').write_text(json.dumps(voice,ensure_ascii=False,indent=1))
(HERE/'voice/script.json').write_text(json.dumps({'duration':DUR,'assembly':'python3 pieces/warung-day4/build_voice.py','lines':script},ensure_ascii=False,indent=2))
(HERE/'voice/selection.json').write_text(json.dumps(selections,ensure_ascii=False,indent=2))
target=HERE/'../../remotion/warung-netizen/src/data/voice-day4.json'
target.write_text(json.dumps(voice,ensure_ascii=False,indent=1))
