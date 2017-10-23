using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PricePolling.ConfigService;

namespace PricePolling
{
   public  class Order
    {
        public string Process()
        {
            File.WriteAllText(@"D:\logs\log.txt", System.DateTime.Now.ToString());
            var jsonData = File.ReadAllText(@"\\DV1VMPMTUI01.oldev.preol.dell.com\tmp\priceRequest.txt");
            var configData = JsonConvert.DeserializeObject<Config[]>(jsonData);
            foreach (var data in configData)
            {
                if (data.AlertOnChange)
                {
                    var configPrice = GetConfigData("EN", "US", "19", data.ConfigItem, 1);
                    if (data.SetPrice <= configPrice && !(configPrice <= 0))
                    {
                        var orderApitext = File.ReadAllText(@"D:\logs\OrderAPIPayload.txt");
                        
                        var jarrayObject = JArray.Parse(orderApitext);
                        foreach (var item in jarrayObject.Children())
                        {
                            var itemProperties = item.Children<JProperty>();
                            //you could do a foreach or a linq here depending on what you need to do exactly with the value
                            var myElement = itemProperties.FirstOrDefault(x => x.Name.ToLower() == "customercontext");
                            ((Newtonsoft.Json.Linq.JValue)myElement.First()["transactionId"]).Value =
                                Guid.NewGuid().ToString();

                        }
                        var postResult = CreateOrder(jarrayObject);
                        Email();


                        return postResult;
                    }
                }
            }
            return string.Empty;
        }

        public string CreateOrder(JArray data)
        {
            var orderApiUrl = "http://g4vmmktp01.olqa.preol.dell.com:1000/Dell.Order.Api/v1/commerce/orders";
            var baseUrl = "http://g4vmmktp01.olqa.preol.dell.com:1000/";
            using (var client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("CmpApiKey", "fed6866352174521a73eee734eaae6bc");
                client.BaseAddress = new Uri(baseUrl);
                client.DefaultRequestHeaders
                    .Accept
                    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string url = $"/Dell.Order.Api/v1/commerce/orders";
                var jsondata = JsonConvert.SerializeObject(data);
                var stringContent = new StringContent(jsondata,
                    Encoding.UTF8,
                    "application/json");
                var result = client.PostAsync(url, stringContent).Result;
                return result.Content.ReadAsStringAsync().Result;

            }
        }

        private static decimal GetConfigData(string languageCode, string countryCode, string customerSet,
            string orderCode, int quantity)
        {
            try
            {
                var service = new ConfigServiceClient("ConfigService.V3.BasicHttpService");

                ProcessRequestRequest input = new ProcessRequestRequest
                {
                    request = new ConfigRequest
                    {
                        LanguageId = languageCode,
                        CountryId = countryCode,
                        CustomerSetId = customerSet,
                        PostType = PostType.NoPost,
                        ConfigRequestFlag =
                            // IncludeItem - return ConfigItem
                            ConfigRequestFlag._262144
                            // SkipLeadTime - GCM will recalculate for us
                            | ConfigRequestFlag._8192
                            // SelectedOptionsOnly - Tells Config to skip extra processing (they always return only selected items)
                            | ConfigRequestFlag._4,
                        OrderCode = "CAI135NW10PH5008", //mocking
                        ItemQuantity = quantity
                    }
                };
                var response = service.ProcessRequest(input);
                decimal price = response.ProcessRequestResult.ConfigItem.OriginalPrice;
                string str = string.Empty;
                return price;
            }
            catch (Exception ex)
            {
                string str = string.Empty;
            }
            return 0;

        }

        public static void Email()
        {
            try
            {
                var APIKey = "d9fcc7fd27070908285afe97dc817563";
                String SecretKey = "73d5881c9ad9aa906ba076f7c11018d8";
                String From = "ashishpthomas@mail.com";
                String To = "ashishpthomas1983@outlook.com";

                var msg = new MailMessage();

                msg.From = new MailAddress(From);

                msg.To.Add(new MailAddress(To));

                msg.Subject = "Dell Purchase Request";
                msg.Body = @"
                Hello Customer,

                    The selling price on theXPS 13has been reduced to $700.You can complete this purchase by clicking on the Order Now button below. ";
                WebRequest.DefaultWebProxy = new WebProxy("127.0.0.1", 8888);
                var client = new SmtpClient("in-v3.mailjet.com", 587);
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.EnableSsl = true;
                client.UseDefaultCredentials = false;

                client.Credentials = new NetworkCredential(APIKey, SecretKey);

                client.Send(msg);
            }
            catch (Exception ex)
            {
                var msg = ex.Message;
            }
        }
    }

    public class Config
    {
        [JsonProperty(PropertyName = "configItem")]
        public string ConfigItem { get; set; }

        [JsonProperty(PropertyName = "userEmail")]
        public string UserEmail { get; set; }
        [JsonProperty(PropertyName = "setPrice")]
        public decimal SetPrice { get; set; }
        [JsonProperty(PropertyName = "alertOnChange")]
        public bool AlertOnChange { get; set; }

    }
}
