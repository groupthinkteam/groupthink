
  const pdfjs = require('pdfjs-dist/es5/build/pdf.js');

var url = "/Users/chinmay/Documents/Resume.pdf";
pdfjs.getDocument(url).promise
    .then(function (pdf) {
        return pdf.getPage(1);
    })
    .then(function (page) {
        var scale = {scale: 1.5};
        var viewport = page.getViewport(scale);
        var canvas = document.createElement('the-canvas');
        var context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        var renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        /*
        page.render(renderContext);
  
        url = canvas.toDataURL();
  
        downloadButton = document.getElementById('download-image');
        downloadButton.setAttribute('download', 'jr.png');
        downloadButton.setAttribute('href', url);
        */
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
            // use canvas now
            var url = canvas.toDataURL();
            console.log(url);
            /*
            var downloadButton = document.getElementById('download-image');
            downloadButton.setAttribute('download', 'jr.png');
            downloadButton.setAttribute('href', url);
            */
        });
    });