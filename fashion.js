"use strict";

var Crawler = require("crawler");

var c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            var bags = [];
            $('div.product-item').each(function (i, e) {
                bags[i] = $(this).text();
            });
            console.log(bags);
        }
        done();
    }
});

//c.queue('https://www.hermes.com/de/de/damen/taschen-und-kleinlederwaren/taschen-und-kleine-taschen/#fh_view_size=108&country=de&fh_location=--%2Fcategories%3C%7Bwomenbagsbagsclutches%7D&fh_start_index=72&positionsku=H060991CC18|relevance|Linie');
c.queue('https://www.hermes.com/de/de/damen/taschen-und-kleinlederwaren/taschen-und-kleine-taschen/#fh_view_size=36&country=de&fh_location=--%2Fcategories%3C%7Bwomenbagsbagsclutches%7D&fh_start_index=300|relevance|Linie');
