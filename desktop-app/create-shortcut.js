const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

try {
  const desktopDir = path.join(process.env.USERPROFILE || 'C:\\Users\\d-a', 'Desktop');
  const targetScript = path.join(__dirname, 'launch-amsed-admin.bat');
  const iconPath = path.resolve(__dirname, '..', 'public', 'favicon.ico');
  const shortcutPath = path.join(desktopDir, 'AMSED Admin Portal.lnk');

  const psScript = `
    $w = New-Object -ComObject WScript.Shell
    $s = $w.CreateShortcut("${shortcutPath.replace(/\\/g, '\\\\')}")
    $s.TargetPath = "${targetScript.replace(/\\/g, '\\\\')}"
    $s.WorkingDirectory = "${__dirname.replace(/\\/g, '\\\\')}"
    $s.Description = "AMSED Admin Portal Dedicated Desktop App"
    $s.Save()
  `;

  execSync(`powershell -NoProfile -Command "${psScript.replace(/\n/g, ' ')}"`);
  console.log('Desktop shortcut created successfully at:', shortcutPath);
} catch (e) {
  console.error('Error creating shortcut:', e.message);
}
