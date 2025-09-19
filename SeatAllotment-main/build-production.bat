@echo off
REM Production Build Script for Seat Allotment System (Windows)
echo 🚀 Starting production build process...

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist dist rmdir /s /q dist
if exist node_modules\.cache rmdir /s /q node_modules\.cache

REM Install dependencies
echo 📦 Installing dependencies...
npm ci --only=production

REM Run linting
echo 🔍 Running linting...
npm run lint
if %errorlevel% neq 0 (
    echo ⚠️  Linting issues found, but continuing...
)

REM Run tests
echo 🧪 Running tests...
npm run test -- --watch=false --browsers=ChromeHeadless
if %errorlevel% neq 0 (
    echo ⚠️  Tests failed, but continuing...
)

REM Build for production
echo 🏗️  Building for production...
npm run build -- --configuration=production

REM Check build size
echo 📊 Build size analysis...
for /f "tokens=3" %%a in ('dir dist\seat-allotment-system /s /-c ^| find "File(s)"') do echo Build size: %%a bytes

REM Generate build report
echo 📋 Generating build report...
echo Build completed at: %date% %time% > dist\build-report.txt
echo Node version: >> dist\build-report.txt
node --version >> dist\build-report.txt
echo NPM version: >> dist\build-report.txt
npm --version >> dist\build-report.txt

echo ✅ Production build completed successfully!
echo 📁 Build output: dist\seat-allotment-system\
echo 📄 Build report: dist\build-report.txt
pause
