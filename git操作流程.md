## 删除 git
rm -rf .git

## 检查当前状态

git status

## git流程

(1) 初始化本地仓库

cd your_rust_project

git init

git remote add origin https://github.com/yesok99/rust.git

(2) 首次提交

git add .

git commit -m "Initial commit"

git push -u origin main  # 推送到 GitHub

git branch -m master main      # 重命名分支

git push -u origin main        # 推送到远程 main 分支


…or create a new repository on the command line
echo "# rust" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/yesok99/rust.git
git push -u origin main

…or push an existing repository from the command line
git remote add origin https://github.com/yesok99/rust.git
git branch -M main
git push -u origin main

## 解决文件夹文件无法上传的问题
git add test1/ -f
git status

强制推送
git fetch origin
git push -u origin main --force-with-lease

# 文件夹无法上传到git的问题
✅ 步骤 1：彻底清除 test1 的子模块缓存
# 1. 检查是否存在隐式子模块配置
ls -la .git/modules/ 2>/dev/null | grep test1 || echo "No cached submodule"

# 2. 移除 test1 的子模块缓存（如果存在）
rm -rf .git/modules/test1

# 3. 重置 git 索引
git rm --cached test1 -f

✅ 步骤 2：重新添加 test1 为普通目录

# 1. 删除 test1 下的 .git 文件（如果存在）
find test1/ -name ".git" -exec rm -rf {} + 2>/dev/null

# 2. 重新添加 test1 内容
git add test1/ --force

# 3. 提交更改
git commit -m "Fix: Convert test1 from submodule to normal directory"
git push origin main

✅ 步骤 3：验证修复结果
# 检查 test1 是否被跟踪
git ls-files | grep test1

# 预期输出（示例）：
# test1/Cargo.toml
# test1/src/main.rs
