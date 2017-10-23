using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Timers;
using PricePolling.ConfigService;

namespace PricePolling
{
    public partial class Polling : ServiceBase
    {
        public Timer AlarmTimer = new System.Timers.Timer();   
        public Polling()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            File.WriteAllText(@"D:\logs\log.txt", "started");
            AlarmTimer.Enabled = true;
            AlarmTimer.Interval = 30000;
            AlarmTimer.Elapsed += AlarmTimer_Elapsed;
        }

        private void AlarmTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            try
            {
                File.WriteAllText(@"D:\logs\log.txt", System.DateTime.Now.ToString());
                var order = new Order();
                var orderData = order.Process();
                File.WriteAllText(@"D;\logs\log.txt", orderData);
            }
            catch (Exception ex)
            {
                File.WriteAllText(@"D;\logs\log.txt", ex.Message);
            }
        }

        protected override void OnStop()
        {
            File.WriteAllText(@"D:\logs\log.txt", "stopped");
        }

        public void PollingTimer_Tick(object sender, EventArgs e)
        {
            try { 
            File.WriteAllText(@"D:\logs\log.txt", System.DateTime.Now.ToString());
            var order = new Order();
            var orderData = order.Process();
            File.WriteAllText(@"D;\logs\log.txt", orderData);
        }
        catch (Exception ex)
        {
            File.WriteAllText(@"D;\logs\log.txt", ex.Message);
        }


}

   
    }
}
