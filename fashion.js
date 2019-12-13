"use strict";

const Crawler = require("crawler");
const email = require("./email");
const fs = require('fs');

const subject = "bolide"; //"picotin";  //"bolide";
const noResultText = "Hoppla!";
const timeout = 1800; //second
var lastTimestamp;

fs.readFile('last_timestamp.txt', (err, data) => { 
    if (err) throw err; 
    console.log(data.toString()); 
    lastTimestamp = parseInt(data.toString());
}) 

var c = new Crawler({
    maxConnections : 1,
    rateLimit: 30000, //millisecond
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            if ($('div.main-title').text() == noResultText) {
                email.sendMail(subject, noResultText);
                console.log(noResultText);
            } else {
                var bags = [];
                $('div.product-item').each(function (i, e) {
                    bags[i] = $(this).text();
                });
                //console.log(bags);
                //console.log(bags.length);
                var currentTimestamp = Math.floor(Date.now() / 1000);
                console.log("current", currentTimestamp);
                console.log("last   ", lastTimestamp);
                if ( currentTimestamp - lastTimestamp > timeout ) {
                    email.sendMail(subject, bags.toString());
                    lastTimestamp = currentTimestamp;
                    fs.writeFile('last_timestamp.txt', lastTimestamp, (err) => { 
                        if (err) throw err; 
                    }) 
                    console.log("send mail " + subject);
                }
            }
        }
        done();
    }
});

const url = 'https://www.hermes.com/de/de/search/?s=' + subject;
c.queue(url);
