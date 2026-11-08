#!/bin/bash
cd /Users/bytedance/Desktop/3.23/.research/readers
while read w; do
  lark-cli whiteboard +export --whiteboard-token $w --output-type preview --output ./wb/$w.jpg --overwrite >/dev/null 2>&1 && echo "ok $w" || echo "FAIL $w"
done < wb_list.txt
