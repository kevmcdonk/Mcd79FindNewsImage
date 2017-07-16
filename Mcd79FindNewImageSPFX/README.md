## mcd-79-find-a-news-image

This webpart aims to make it easier to add images for news pages by using an Azure Function to call the Bing Image API. This project holds the SharePoint Framework project but requires a reference to the built Azure Function.

### Building the code

SharePoint Framework

```bash
npm i
npm i -g gulp
gulp
```

Open /src/webparts/findANewsImage/FindANewsImageWebPart.ts and update the property functionUrl with the correct Url to the Azure function.


This package produces the following:

* lib/* - intermediate-stage commonjs build artifacts
* dist/* - the bundled script, along with other resources
* deploy/* - all resources which should be uploaded to a CDN.

Deployment follows the same details as a standard SharePoint Framework webpart.

### Build options

gulp clean - TODO
gulp test - TODO
gulp serve - TODO
gulp bundle - TODO
gulp package-solution - TODO
