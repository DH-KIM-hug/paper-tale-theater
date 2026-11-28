"""웅장함 간단 측정: 음량 범위(EBU LRA, LU), 250Hz 아래 저음 에너지 비율(%), 넓은 대역 정도(스펙트럼 중심 Hz), 최대 순간 음량(M max).
쓰기: python grandeur.py 파일...   (원본 생성 파일 기준으로 비교)"""
import sys, subprocess, re, numpy as np, librosa
def lra(p):
    r=subprocess.run(['ffmpeg','-nostats','-i',p,'-af','ebur128','-f','null','-'],capture_output=True,text=True).stderr
    L=re.findall(r'LRA:\s+(-?[\d.]+) LU',r); I=re.findall(r'I:\s+(-?[\d.]+) LUFS',r)
    M=[float(x) for x in re.findall(r' M:\s*(-?[\d.]+)',r) if float(x)>-70]
    return float(L[-1]), float(I[-1]), max(M)-float(I[-1])
def measure(p):
    y,sr=librosa.load(p,sr=22050,mono=True)
    S=np.abs(librosa.stft(y,n_fft=4096))**2; f=librosa.fft_frequencies(sr=sr,n_fft=4096)
    low=S[f<250].sum()/S.sum()*100; cen=float(librosa.feature.spectral_centroid(y=y,sr=sr).mean())
    a,i,pk=lra(p); return {'LRA':round(a,1),'low%':round(float(low),1),'centroid':round(cen),'Mpeak-I':round(pk,1)}
if __name__=='__main__':
    for p in sys.argv[1:]: print(p.split('/')[-1],measure(p),flush=True)
