"""从冻结的 Git 原件恢复历史发布附件，不重新打包旧引擎。"""
import argparse
import hashlib
import io
import json
import subprocess
import zipfile
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--output', required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parent.parent
output = Path(args.output).resolve()
output.mkdir(parents=True, exist_ok=False)
versions = {'1.0.0': 'f1fe58d', '1.0.1': '4d143d1', '1.0.2': '56f9546'}
for version, revision in versions.items():
    commit = subprocess.check_output(['git', 'rev-parse', revision], cwd=root, text=True).strip()
    base = 'releases/ghostmaze-playtest/'
    names = ['ghostmaze-playtest-skill.zip', 'ghostmaze-playtest-plugin.zip', 'verification.json']
    if version == '1.0.0':
        names += ['sample-report.md', 'javascript-play-record.json']
    # 每个提交的根目录正是当时版本；不用后来复制到版本子目录的路径。
    files = {name: subprocess.check_output(['git', 'show', commit + ':' + base + name], cwd=root) for name in names}
    for kind in ['skill', 'plugin']:
        with zipfile.ZipFile(io.BytesIO(files[f'ghostmaze-playtest-{kind}.zip'])) as archive:
            if archive.testzip() is not None:
                raise ValueError('历史安装包损坏')
            prefix = 'ghostmaze-playtest/' if kind == 'skill' else 'ghostmaze-playtest/skills/ghostmaze-playtest/'
            manifest = json.loads(archive.read(prefix + 'assets/manifest.json'))
            if manifest['version'] != version:
                raise ValueError('历史包版本不匹配')
    files['manifest.json'] = (json.dumps(manifest, ensure_ascii=False, indent=2) + '\n').encode()
    hashes = {name: hashlib.sha256(data).hexdigest() for name, data in files.items()}
    migration = {'version': version, 'tag': 'playtest-v' + version, 'sourceCommit': commit, 'engine': manifest['engine'],
                 'originalZipBytesPreserved': True, 'originalGitPath': base.rstrip('/'), 'assets': hashes}
    files['migration.json'] = (json.dumps(migration, ensure_ascii=False, indent=2) + '\n').encode()
    checksums = {name: hashlib.sha256(data).hexdigest() for name, data in files.items()}
    files['SHA256SUMS.txt'] = ''.join(f'{digest}  {name}\n' for name, digest in checksums.items()).encode()
    latest = '当前推荐版本。' if version == '1.0.2' else '历史版本，用于恢复已有记录；新试玩请使用最新版本。'
    notes = f'''# 鬼迷宫AI试玩 {version}

{latest}

手动调用，AI 读取文字局面，自主选择动作，由真实游戏引擎推进；交付过程、评价、感受和回放。支持已知规则／探索规则、普通通关／最短目标步数挑战。

下载 `ghostmaze-playtest-skill.zip`；需要插件包装时下载 `ghostmaze-playtest-plugin.zip`。使用支持技能资源和 JavaScript 实际执行的聊天环境，下载不会自动安装到 ChatGPT；Codex 可使用仓库原生技能。

[完整使用说明](https://github.com/Pre-rice/ghost-maze/blob/main/docs/ai-playtest.md) · [对应源码](https://github.com/Pre-rice/ghost-maze/tree/{commit}/.agents/skills/ghostmaze-playtest)

原安装包迁入 Release，ZIP 保持原字节。引擎固定为 `{manifest['engine']}`；旧记录用原版恢复。`SHA256SUMS.txt` 核验下载文件，`migration.json` 记录原来源。

随包执行、独立运行和恢复已有工程验收，原验证记录随包保留。普通 ChatGPT 账号端的实际安装与首次调用尚未实测；本次迁移不新增盲玩体验。
'''
    files['release-notes.md'] = notes.encode()
    directory = output / version
    directory.mkdir()
    for name, data in files.items():
        (directory / name).write_bytes(data)
    print(json.dumps({'version': version, 'sourceCommit': commit, 'engine': manifest['engine'], 'files': len(files)}, ensure_ascii=False))
