#r "System.Web.Http"
#r "Newtonsoft.Json"

using System.Net;
using System.Web.Http;
using System.Collections.Generic;
using Newtonsoft.Json;
public class Photo {
    public string Title;
    public int Id;
    public string ImageUrl;
    public string ThumbnailUrl;
    public string LicenseDetails;
    public int imageWidth;
    public int imageHeight;    
}

public class FlickrPhotoCollection {
    public int page;
    public int pages;
    public int perpage;
    public int total;

    public List<FlickrPhoto> photo;
}

public class FlickrPhoto {
    public string id;
    public string owner;
    public string secret;
    public string server;
    public string farm;
    public string title;
    public string ispublic;
    public string isfriend;
    public string isfamily;
}

public static async Task<Photo> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    // parse query parameter
    string query = req.GetQueryNameValuePairs()
        .FirstOrDefault(q => string.Compare(q.Key, "query", true) == 0)
        .Value;
    
    log.Info(query);
    // Get request body
    dynamic data = await req.Content.ReadAsAsync<object>();

    // Set name to query string or body data
    query = query ?? data?.query;

    if (query == null) {
         req.CreateResponse(HttpStatusCode.BadRequest, "Please pass a query on the query string or in the request body");
    }
     var client = new HttpClient();
      
      // Request headers  
      client.DefaultRequestHeaders.Add("Ocp-Apim-Subscription-Key", "E5bb0f3391e348998184b63817b29971");// put your //key here
      var queryStringText = "";
      queryStringText += "q=" + query;
      queryStringText += "&license=Share";
      /*
      aspect—Filter images by aspect ratio (for example, standard or wide screen images)
color—Filter images by dominant color or black and white
freshness—Filter images by age (for example, images discovered by Bing in the past week)
height, width—Filter images by width and height
imageContent—Filter images by content (for example, images that show only a person's face)
imageType—Filter images by type (for example, clip art, animated GIFs, or transparent backgrounds)
license—Filter images by the type of license associated with the site
size—Filter images by size, such as small images up to 200x200 pixels
 
      var uri = "https://api.cognitive.microsoft.com/bing/v5.0/images/search?" + queryStringText;
      log.Info(uri);
      using (var r = await client.GetAsync(new Uri(uri)))
      {
        string result = await r.Content.ReadAsStringAsync();
        log.Info("BING: " + result);
*/
        var flickrUri = "https://api.flickr.com/services/rest/?method=flickr.photos.search&text=" + queryStringText + "&license=1&api_key=5bc4402e16622fe56a64e7d2dceb4836&format=json";
        using (var rf = await client.GetAsync(new Uri(flickrUri)))
        {
            var result = new List<Photo>();
            string flickrResult = await rf.Content.ReadAsStringAsync();
            FlickrPhotoCollection photoCollection = JsonConvert.DeserializeObject<FlickrPhoto>(flickrResult);
            foreach(var photo in photoCollection.photo) {
                logInfo("Photo");
            }
            log.Info("Flickr: " + flickrResult);
        }
    
        return result == null
        ? req.CreateResponse(HttpStatusCode.BadRequest, "No response found, check log for details")
        : req.CreateResponse(HttpStatusCode.OK, result);
      }

    
}
