import cv2
import os

video_map = {
    'pixie1': 'public/assets/pixie/video/pixie1.mp4',
    'pixie2': 'public/assets/pixie/video/pixei2.mp4',
    'pixie3': 'public/assets/pixie/video/pixie3.mp4',
    'pixie4': 'public/assets/pixie/video/pixie4.mp4',
    'pixie5': 'public/assets/pixie/video/pixie5.mp4',
}

# Number of sampled frames (40-60 frames is ultra smooth and fast to load)
NUM_FRAMES = 48

for name, video_path in video_map.items():
    out_dir = f'public/assets/pixie/frames/{name}'
    os.makedirs(out_dir, exist_ok=True)
    
    cap = cv2.VideoCapture(video_path)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    print(f"Extracting {name} ({total_frames} total frames -> {NUM_FRAMES} samples)...")
    
    step = total_frames / NUM_FRAMES
    for i in range(NUM_FRAMES):
        target_idx = min(int(i * step), total_frames - 1)
        cap.set(cv2.CAP_PROP_POS_FRAMES, target_idx)
        ret, frame = cap.read()
        if ret:
            out_file = os.path.join(out_dir, f"frame_{i:03d}.webp")
            # Save as high quality webp
            cv2.imwrite(out_file, frame, [cv2.IMWRITE_WEBP_QUALITY, 88])
    cap.release()

print("All frames extracted successfully!")
