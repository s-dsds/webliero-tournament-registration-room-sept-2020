function genNewMap() {
    (async () => {
        await load_fonts([
            'https://fonts.googleapis.com/css2?family=Comic+Neue:wght@700&display=swap',
        ]);
        pixConvFailures = 0;
        var createCanvas =function(w,h){
            var c = document.createElement("canvas");
            c.width  = w;
            c.height = h;
            c.ctx    = c.getContext("2d");

            return c;
        }
        const cw = 504;
        const ch = 350;
        var c = createCanvas(cw,ch);
        var ctx = c.getContext("2d", {alpha: false});
        base_image = new Image();

        base_image.src = batmanPNG;
        base_image.onload = function(){ 
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(base_image, 0, 0);
            ctx.font = "24px Comic Neue";
            ctx.fillStyle = "#542800";
            ctx.textAlign = "center";
            ctx.fillText("already "+subscribedPlayers.size+" Players registered!", 252, 120); 	
            const reset = 170;
            const max = 330;
            let widthS = 50;
            let heightS = reset;
            var x = 0;
            for (let pl of  subscribedPlayers.values()) {
                var fname=pl.name.substring(0,16);
                if (fname==" ") {
                    fname="'' ''";
                }
                ctx.font = "15px Comic Neue";
                ctx.textAlign = "left";
                ctx.fillStyle = "#88480c";		   
                ctx.lineWidth=1;
                ctx.strokeText(fname, widthS, heightS); 
                ctx.fillText(fname, widthS, heightS); 
                heightS = heightS + 22;
                if (heightS>max) {				
                    heightS = x%2!=0?reset:reset+14;
                    x++;
                    widthS = widthS + 110;
                }		
            }
            
            var imgData = ctx.getImageData(0, 0, 504, 350);
            let rawData = [];

            for (let i = 0; i < imgData.data.length; i += 4) {
                let colorVal = getbestpixelValue(imgData.data[i],imgData.data[i + 1],imgData.data[i + 2]);
                rawData.push(colorVal);
                if (colorVal==1) {			
                    imgData.data[i]=108;
                    imgData.data[i + 1]=56;
                    imgData.data[i + 2]=00;
                    imgData.data[i + 3]=255;
                }
                
            }
            ctx.putImageData(imgData, 20, 0); 
            console.log("done", rawData, pixConvFailures);
            let buff=new Uint8Array(rawData).buffer;
            window.WLROOM.loadLev("batman_custom.lev",buff);
            mypool = [{fn:"batman_custom.lev", data:buff}];
        }
            
    })();
}
let pixConvFailures = 0;
function getbestpixelValue(red,green,blue) {
    let colorVal = Array.prototype.slice.call(arguments).join("_");;
    if (invPal.get(colorVal)==undefined) {
            pixConvFailures++;			
            return 1;
            
        } 
        return invPal.get(colorVal);		
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}
