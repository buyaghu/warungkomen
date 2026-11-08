"""Two-pass EBU R128 normalization; save measured values for reproducibility."""
import json, pathlib, re, subprocess
HERE=pathlib.Path(__file__).resolve().parent
target=HERE/'../../remotion/warung-netizen/public/day3/audio.wav'
target.parent.mkdir(parents=True,exist_ok=True)
first=subprocess.run(['ffmpeg','-hide_banner','-i',str(HERE/'mix.wav'),'-af','loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
measure=json.loads(re.findall(r'\{[^{}]+\}',first.stderr)[-1])
filt=f"loudnorm=I=-14:TP=-1.5:LRA=11:measured_I={measure['input_i']}:measured_TP={measure['input_tp']}:measured_LRA={measure['input_lra']}:measured_thresh={measure['input_thresh']}:offset={measure['target_offset']}:linear=true:print_format=json"
second=subprocess.run(['ffmpeg','-hide_banner','-y','-i',str(HERE/'mix.wav'),'-af',filt,'-ar','48000','-c:a','pcm_s16le',str(target)],capture_output=True,text=True,check=True)
after=json.loads(re.findall(r'\{[^{}]+\}',second.stderr)[-1])
(HERE/'loudness.json').write_text(json.dumps({'first_pass':measure,'second_pass':after},indent=2))
print(after)
