async function load_fonts(font_urls) {
    function load(font_url) {
        return new Promise(function(resolve, reject) {
            if (load_fonts.loaded.has(font_url)) {
                resolve();
            } else {
                var link = document.createElement('link');
                link.onload = resolve;
                link.href = font_url;
                link.rel = "stylesheet";
                document.head.appendChild(link);
            }
        });
    }
    var promises = [];
    for (const font_url of font_urls) {
        promises.push(load(font_url));
    }
    await Promise.all(promises);
    for (const font_url of font_urls) {
        load_fonts.loaded.add(font_url);
    }
}
load_fonts.loaded = new Set();
