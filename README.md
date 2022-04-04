# Epic-kitchens Clip Narrion GIF Viewer 


## Setup

- Generate json file:
    - Change script.js to the generated json file

```python
import json
import pandas as pd

df = pd.read_csv('<path-to-epic-kitchens-100-annotations>/EPIC_100_train.csv')

save_file = 'out.json'
df.to_json(save_file, orient='records')
```

- Add symlink to epic-rgb-frames 

```bash
ln -s <path-to-epic_100_rgb_frames> epic_root
```
