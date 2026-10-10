$WshShell = New-Object -ComObject WScript.Shell
$DesktopPath = [System.Environment]::GetFolderPath([System.Environment+SpecialFolder]::Desktop)
$ShortcutPath = Join-Path $DesktopPath "AMSED Admin Portal.lnk"

$TargetBat = "c:\Users\d-a\Desktop\WEB-ASSO-AD\desktop-app\launch-amsed-admin.bat"
$IconPath = "c:\Users\d-a\Desktop\WEB-ASSO-AD\public\favicon.png"

$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $TargetBat
$Shortcut.WorkingDirectory = "c:\Users\d-a\Desktop\WEB-ASSO-AD\desktop-app"
$Shortcut.Description = "تطبيق لوحة تحكم جمعية AMSED المستقل"
if (Test-Path $IconPath) {
    $Shortcut.IconLocation = "$IconPath,0"
}
$Shortcut.Save()

Write-Host "Created Desktop Shortcut at: $ShortcutPath"
