"""Validate final H.264/AAC deliveries, complete decode, loudness and hashes."""
import hashlib, json, pathlib, re, subprocess, sys
ROOT=pathlib.Path(__file__).resolve().parents[2]
report_path=ROOT/'episodes/day3/validation.json'
report=json.loads(report_path.read_text()) if report_path.exists() else {}
for name,rel in [('instagram','instagram/day3-reel.mp4'),('tiktok','tiktok/day3-tiktok.mp4')]:
    if len(sys.argv)>1 and sys.argv[1]!=name:continue
    path=ROOT/rel
    data=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_format','-show_streams','-of','json',str(path)],text=True))
    video=next(s for s in data['streams'] if s['codec_type']=='video')
    audio=next(s for s in data['streams'] if s['codec_type']=='audio')
    assert (video['width'],video['height'])==(1080,1920)
    assert video['codec_name']=='h264' and video['r_frame_rate']=='24/1'
    assert audio['codec_name']=='aac' and audio['channels']==2 and audio['sample_rate']=='48000'
    assert abs(float(data['format']['duration'])-95)<.1
    assert int(video['nb_frames'])==2280
    decode=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','null','-'],capture_output=True,text=True,check=True)
    assert not decode.stderr, decode.stderr
    loud=subprocess.run(['ffmpeg','-hide_banner','-i',str(path),'-vn','-af','loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json','-f','null','-'],capture_output=True,text=True,check=True)
    measured=json.loads(re.findall(r'\{[^{}]+\}',loud.stderr)[-1])
    assert abs(float(measured['input_i'])+14)<.5
    assert float(measured['input_tp'])<=-1.0
    report[name]={'path':rel,'duration':float(data['format']['duration']),'width':1080,'height':1920,'fps':24,'frames':2280,'video_codec':video['codec_name'],'audio_codec':audio['codec_name'],'loudness_lufs':float(measured['input_i']),'true_peak_dbtp':float(measured['input_tp']),'size_bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'full_decode':'pass'}
    print(name,report[name],flush=True)
report_path.write_text(json.dumps(report,indent=2)+'\n')
