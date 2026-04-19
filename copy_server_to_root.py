# Copy server.py and requirements.txt to repo root for Railway deploy
import shutil
import os

src_dir = os.path.join(os.getcwd(), 'server')
root_dir = os.getcwd()

for fname in ['server.py', 'requirements.txt']:
    src = os.path.join(src_dir, fname)
    dst = os.path.join(root_dir, fname)
    if os.path.exists(src):
        shutil.copy2(src, dst)
        print(f'Copied {fname} to repo root.')
    else:
        print(f'{fname} not found in server/.')
