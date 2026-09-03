import cv2
import os

video_path = 'public/assets/pixar/video/character4.mp4'
out_dir = 'public/assets/pixar/frames/character4'
os.makedirs(out_dir, exist_ok=True)

cap = cv2.VideoCapture(video_path)
total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

NUM_FRAMES = 96
step = total_frames / NUM_FRAMES

print(f"Re-extracting {NUM_FRAMES} high-quality frames for Character 4 from {total_frames} total frames...")

for i in range(NUM_FRAMES):
    target_idx = min(int(i * step), total_frames - 1)
    cap.set(cv2.CAP_PROP_POS_FRAMES, target_idx)
    ret, frame = cap.read()
    
    if ret:
        out_file = os.path.join(out_dir, f"frame_{i:03d}.webp")
        # Save as high-quality WebP for ultra-smooth 60fps canvas animation
        cv2.imwrite(out_file, frame, [cv2.IMWRITE_WEBP_QUALITY, 92])

cap.release()
print(f"Successfully re-extracted all {NUM_FRAMES} frames for Character 4 in '{out_dir}'!")
