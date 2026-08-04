# 项目协作规则

所有与方仲达、未来可乐团队、友邦保险相关的网站和数字内容工作，必须先阅读并遵守 `docs/AIA-BRAND-GUIDELINES.md`。

- 核心配色仅使用 AIA Red、AIA Charcoal、AIA Olive。
- 中性辅助仅使用规范中的 AIA Dark Green、AIA Warm Grey、White 及其透明度层级。
- 其他 AIA 辅助色只能用于必要的功能区分，不得改变品牌主视觉。
- 未经用户明确批准，不引入新的非 AIA 品牌色。
- 首页 Hero 优先展示团队、办公环境或品牌场景；个人介绍置于其后。

## PowerShell 安全调用规则（Windows）

本环境是 win32 + PowerShell 5.1。执行命令时不要把 PowerShell 当 Bash，遵循以下决策顺序：

1. 能用 PowerShell cmdlet 就用 cmdlet。
2. 调用外部程序时，把每个参数作为数组独立元素，用 `& $exe @args`，不要拼大字符串；判断成功用 `$LASTEXITCODE`，不用 `$?` 的 cmdlet 语义。
3. 命令复杂时写临时 `.ps1` 文件，再用 `pwsh.exe -NoLogo -NoProfile -NonInteractive -File script.ps1` 执行，不要塞进 `-Command`。
4. 必须精确控制进程参数时用 `ProcessStartInfo.ArgumentList`。
5. 只有需要新窗口、提权、脱离当前进程等特殊行为时才用 `Start-Process`。
6. 只有确实需要 cmd 语义时才套 `cmd.exe /c`。
7. `Invoke-Expression` 放到最后，且非常克制。

其他约束：

- 对真实文件路径优先用 cmdlet 的 `-LiteralPath`（字面量，避免 `[]*?` 被当通配符）；只有需要通配符时才用展开参数。
- `powershell.exe` 是 Windows PowerShell 5.1，`pwsh.exe` 是 PowerShell 7；不确定时先查 `$PSVersionTable.PSVersion`。
- cmdlet 错误用 `-ErrorAction Stop` 依赖终止错误；外部程序用 `$LASTEXITCODE`，两者不要混用。
- 写文件时编码（UTF-8）与换行（CRLF/LF）是一等问题；写入中文等非 ASCII 内容后立即验证，检查乱码/mojibake 与 front matter 闭合。
- 不要用 Bash 风格的 `\"` 去写 PowerShell；不要用 `Start-Process -ArgumentList` 处理复杂参数。

规则来源：https://knightli.com/2026/07/01/codex-vs-powershell-safe-invocation/（powershell-safe-invocation skill）
