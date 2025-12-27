@echo off
chcp 65001 > nul
echo ========================================
echo   Gitee Pages 快速部署脚本
echo ========================================
echo.

echo [1/4] 正在安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败！
    pause
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

echo [2/4] 正在构建项目...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ 项目构建失败！
    pause
    exit /b 1
)
echo ✅ 项目构建完成
echo.

echo [3/4] 正在提交到 Git...
git add .
if %errorlevel% neq 0 (
    echo ❌ Git add 失败！
    pause
    exit /b 1
)

set /p commit_msg="请输入提交信息（默认：更新网站）: "
if "%commit_msg%"=="" set commit_msg=更新网站

git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo ❌ Git commit 失败！
    pause
    exit /b 1
)
echo ✅ 提交完成
echo.

echo [4/4] 正在推送到 Gitee...
git push
if %errorlevel% neq 0 (
    echo ❌ Git push 失败！
    pause
    exit /b 1
)
echo ✅ 推送完成
echo.

echo ========================================
echo   🎉 部署成功！
echo ========================================
echo.
echo 📌 接下来的步骤：
echo   1. 访问 https://gitee.com/sunjieLLM/gitee_io
echo   2. 点击"服务" → "Gitee Pages"
echo   3. 点击"更新"按钮
echo   4. 等待 1-5 分钟
echo   5. 访问 https://sunjiellm.gitee.io/gitee_io/
echo.
echo 💡 提示：每次更新代码后，都需要在 Gitee Pages 页面点击"更新"按钮
echo.
pause
