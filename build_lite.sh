#!/bin/bash
# Build script for ECU Tuner Lite
# Creates standalone .exe for Windows 7+

set -e  # Exit on error

echo "=========================================="
echo "ECU Tuner Lite - Build Script"
echo "=========================================="

# Step 1: Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Run this script from the project root"
    exit 1
fi

# Step 2: Build TypeScript in lite/
echo ""
echo "📦 Step 1/4: Compiling TypeScript..."
cd lite
npm run build
if [ $? -ne 0 ]; then
    echo "❌ TypeScript compilation failed"
    exit 1
fi
echo "✅ TypeScript compiled successfully"

# Step 3: Package with pkg
echo ""
echo "📦 Step 2/4: Packaging with pkg..."
npm run package
if [ $? -ne 0 ]; then
    echo "❌ pkg packaging failed"
    exit 1
fi
echo "✅ .exe created successfully"

# Step 4: Copy web/ folder to root
echo ""
echo "📦 Step 3/4: Copying web/ folder..."
cd ..
cp -r lite/web .
echo "✅ web/ folder copied"

# Step 5: Show results
echo ""
echo "📦 Step 4/4: Build complete!"
echo "=========================================="
echo "Distribution files:"
ls -lh ECU_Tuner_Lite.exe
du -sh web/
echo "=========================================="
echo ""
echo "✅ ECU Tuner Lite build complete!"
echo ""
echo "📁 Distribution structure:"
echo "   ECU_Tuner_Lite.exe (37 MB)"
echo "   web/ (44 KB)"
echo ""
echo "💡 To test:"
echo "   - Copy both ECU_Tuner_Lite.exe and web/ folder to Windows machine"
echo "   - Run ECU_Tuner_Lite.exe"
echo "   - Browser will open automatically"
echo ""
