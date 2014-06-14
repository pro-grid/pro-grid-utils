var jq = document.createElement('script');
jq.src = "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

var delay = 1000;
var i = 0; var x = 0;

for(i = 0; i < 32; i++) {
 for(x = 0; x < 32; x++) {
   setTimeout(
       (function(i,x) {
           return function() {
              if($('.col_' + i + '_' + x).style.backgroundColor) {
                $('.col_' + i + '_' + x).click();
              }
           }
       })(i,x), delay);
   delay += 1000;
 }
}