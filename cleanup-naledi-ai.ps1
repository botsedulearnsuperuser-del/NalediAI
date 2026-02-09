# Naledi AI Cleanup Script
# This script removes all Tirelo salon/provider features and other unused app files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NALEDI AI - File Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "c:\Users\ADMIN\Downloads\TSAMAYAMOBILEAPP - Copy (2) - Copy"
Set-Location $projectRoot

Write-Host "Deleting Tirelo Provider screens..." -ForegroundColor Yellow

# Delete Provider screens using wildcard
$providerFiles = Get-ChildItem "src\screens\auth\TireloProvider*.tsx" -ErrorAction SilentlyContinue
foreach ($file in $providerFiles) {
    Remove-Item $file.FullName -Force
    Write-Host "  ✓ Deleted: $($file.Name)" -ForegroundColor Green
}

Write-Host ""
Write-Host "Deleting Salon/Booking screens..." -ForegroundColor Yellow

# Delete specific salon/booking screens
$salonFiles = @(
    "src\screens\auth\TireloBookingScreen.tsx",
    "src\screens\auth\TireloReviewBookingScreen.tsx",
    "src\screens\auth\TireloAppointmentConfirmedScreen.tsx",
    "src\screens\auth\TireloSalonDetailsScreen.tsx",
    "src\screens\auth\TireloExploreScreen.tsx",
    "src\screens\auth\TireloFilterScreen.tsx",
    "src\screens\auth\TireloMapScreen.tsx",
    "src\screens\auth\TireloOffersScreen.tsx",
    "src\screens\auth\TireloMyAppointmentsScreen.tsx",
    "src\screens\auth\TireloConfirmationScreen.tsx",
    "src\screens\auth\TireloConditionsScreen.tsx"
)

foreach ($file in $salonFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Deleted: $(Split-Path $file -Leaf)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Deleting other app screens (Tsamaya, StudyBuddy)..." -ForegroundColor Yellow

# Delete Rider (Tsamaya) screens
$riderFiles = Get-ChildItem "src\screens\auth\Rider*.tsx" -ErrorAction SilentlyContinue
foreach ($file in $riderFiles) {
    Remove-Item $file.FullName -Force
    Write-Host "  ✓ Deleted: $($file.Name)" -ForegroundColor Green
}

# Delete StudyBuddy screens
$studyBuddyFiles = Get-ChildItem "src\screens\auth\StudyBuddy*.tsx" -ErrorAction SilentlyContinue
foreach ($file in $studyBuddyFiles) {
    Remove-Item $file.FullName -Force
    Write-Host "  ✓ Deleted: $($file.Name)" -ForegroundColor Green
}

# Delete other unused auth screens
$otherAuthFiles = @(
    "src\screens\auth\SignInScreen.tsx",
    "src\screens\auth\SignUpScreen.tsx",
    "src\screens\auth\ForgotPasswordScreen.tsx",
    "src\screens\auth\ChangePasswordScreen.tsx",
    "src\screens\auth\PasswordChangedSuccessScreen.tsx",
    "src\screens\auth\OTPVerificationScreen.tsx",
    "src\screens\auth\ResetPasswordScreen.tsx",
    "src\screens\auth\VerificationCodeScreen.tsx",
    "src\screens\auth\TireloAffirmationsScreen_styles_addition.txt"
)

foreach ($file in $otherAuthFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  ✓ Deleted: $(Split-Path $file -Leaf)" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "Deleting unused folders..." -ForegroundColor Yellow

# Delete folders
$foldersToDelete = @(
    "src\screens\payment",
    "src\screens\studybuddy",
    "src\screens\support",
    "src\screens\home"
)

foreach ($folder in $foldersToDelete) {
    if (Test-Path $folder) {
        Remove-Item $folder -Recurse -Force
        Write-Host "  ✓ Deleted folder: $folder" -ForegroundColor Green
    } else {
        Write-Host "  - Folder not found: $folder" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ✓ Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Naledi AI now contains only mental health features:" -ForegroundColor White
Write-Host "  • AI Chat (Cognitive Reframing)" -ForegroundColor White
Write-Host "  • Daily Mood Check-ups" -ForegroundColor White
Write-Host "  • Affirmations & Exercises" -ForegroundColor White
Write-Host "  • Daily Wisdom Content" -ForegroundColor White
Write-Host "  • Crisis Support" -ForegroundColor White
Write-Host "  • Chat History" -ForegroundColor White
Write-Host "  • User Profile" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
