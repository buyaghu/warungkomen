"""Transcribe both takes, score against the approved line, preserve word timings."""
import difflib, json, os, pathlib, re, subprocess
import numpy as np
from faster_whisper import WhisperModel

HERE=pathlib.Path(__file__).resolve().parent
manifest=json.loads((HERE/'voice/generation-manifest.json').read_text())
model=WhisperModel(os.environ.get('WHISPER_MODEL','base'),device='cpu',compute_type='int8',cpu_threads=3,download_root=str(HERE/'../../.venv/models'))
out=[]
def clean(s):
    s=s.lower().replace('gw','gue')
    for a,b in [('sudah','udeh'),('tidak','kagak'),('kemarin','kemaren'),('saja','aje'),('pakai','pake'),('belum','belom'),('42','empat puluh dua'),('28','dua puluh delapan'),('tiga','tiga')]:s=s.replace(a,b)
    return re.sub(r'[^a-z0-9 ]','',s)
for line in manifest['lines']:
    row={'id':line['id'],'text':line['text'],'takes':[]}
    for take in line['takes']:
        p=HERE/'voice'/take['file']
        raw=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-af','silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.02,areverse','-ac','1','-ar','16000','-f','f32le','-'],capture_output=True,check=True).stdout
        audio=np.frombuffer(raw,dtype=np.float32)
        segments,_=model.transcribe(audio,language='id',beam_size=3,word_timestamps=True,vad_filter=False)
        segments=list(segments);text=' '.join(s.text.strip() for s in segments)
        words=[{'w':w.word.strip(),'t0':round(w.start,3),'t1':round(w.end,3)} for s in segments for w in s.words or []]
        score=difflib.SequenceMatcher(None,clean(line['text']),clean(text)).ratio()
        row['takes'].append({**take,'heard':text,'score':round(score,3),'trimmed_duration':len(audio)/16000,'words':words})
    row['selected']=max(range(2),key=lambda i:(row['takes'][i]['score'],-row['takes'][i]['trimmed_duration']))
    out.append(row)
    (HERE/'voice/take-audit.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
    print(row['id'],[(t['score'],t['heard']) for t in row['takes']],'selected',row['selected'],flush=True)
