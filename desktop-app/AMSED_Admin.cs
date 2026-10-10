using System;
using System.Diagnostics;
using System.IO;
using System.Windows.Forms;

namespace AMSEDAdmin {
    public class Program {
        [STAThread]
        public static void Main(string[] args) {
            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);

            string targetUrl = "https://asso-amsed.vercel.app/portal-amsed-secure-x98k21/admin?key=amsed_vault_secure_987654";

            // Launch in dedicated standalone desktop application mode (No URL bar, dedicated native desktop window)
            bool launched = LaunchAppMode("msedge.exe", targetUrl) || LaunchAppMode("chrome.exe", targetUrl);

            if (!launched) {
                try {
                    Process.Start(new ProcessStartInfo(targetUrl) { UseShellExecute = true });
                } catch (Exception ex) {
                    MessageBox.Show("خطأ أثناء تشغيل لوحة الإدارة AMSED: " + ex.Message, "AMSED Admin Portal", MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
        }

        private static bool LaunchAppMode(string browserExe, string url) {
            try {
                ProcessStartInfo psi = new ProcessStartInfo {
                    FileName = browserExe,
                    Arguments = "--app=\"" + url + "\" --window-size=1440,920",
                    UseShellExecute = true,
                    WindowStyle = ProcessWindowStyle.Normal
                };
                Process.Start(psi);
                return true;
            } catch {
                return false;
            }
        }
    }
}
