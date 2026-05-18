# Nuvera Naturals Git Push Automation Script
Write-Host "Starting Git Push Automation for Nuvera Naturals..."

# 1. Initialize Git if not already done
if (!(Test-Path .git)) {
    Write-Host "Initializing local Git repository..."
    git init
} else {
    Write-Host "Git repository already initialized."
}

# 2. Add remote origin
Write-Host "Setting remote origin..."
git remote remove origin 2>$null
git remote add origin https://github.com/pundorakartik2210-prog/ecommerce-.git

# 3. Add all custom files
Write-Host "Staging changes..."
git add .

# 4. Commit files
Write-Host "Committing files..."
git commit -m "feat: Flipkart sidebar console, photorealistic product catalog, and SEO optimizations"

# 5. Push code
Write-Host "Pushing code to GitHub (main branch)..."
git branch -M main
git push -u origin main

Write-Host "Finished pushing code! Visit: https://github.com/pundorakartik2210-prog/ecommerce-"
