"use strict";

const Crawler = require("crawler");
const email = require("./email");
const fs = require('fs');

const liveCheckTimeout = 60 * 60 * 24;
var currentTimestamp = Math.floor(Date.now() / 1000);
var lastLiveCheck;
var lastLiveCheckFile = 'last_live_check.txt';
fs.readFile(lastLiveCheckFile, (err, data) => { 
    if (err) throw err; 
    lastLiveCheck = parseInt(data.toString());
    console.log("lastLiveCheck: " + lastLiveCheck);
    if (currentTimestamp - lastLiveCheck > liveCheckTimeout) {
        email.sendMail("fashion app live check", "still live...", undefined);
        lastLiveCheck = currentTimestamp;
        fs.writeFile(lastLiveCheckFile, lastLiveCheck, (err) => { 
            if (err) throw err; 
        }) 
        console.log("send mail live check");
    }
}) 

const subject = "picotin";  //"bolide";
const noResultText = "Hoppla!";
const notificationTimeout = 1800; //30 minutes
var recipient = process.argv[2];
var lastNotificationFile = 'last_notification.txt';
var lastNotification;
fs.readFile(lastNotificationFile, (err, data) => { 
    if (err) throw err; 
    lastNotification = parseInt(data.toString());
    console.log("lastNotification: " + lastNotification);
}) 

var c = new Crawler({
    maxConnections : 1,
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            var $ = res.$;
            if ($('div.main-title').text() == noResultText) {
                //email.sendMail(subject, noResultText, recipient);
                console.log(noResultText);
            } else {
                var bags = [];
                $('div.product-item').each(function (i, e) {
                    bags[i] = $(this).text();
                });
                //console.log(bags);
                //console.log(bags.length);
                console.log("current: " + currentTimestamp);
                if ( currentTimestamp - lastNotification > notificationTimeout ) {
                    email.sendMail(subject, bags.toString(), recipient);
                    lastNotification = currentTimestamp;
                    fs.writeFile(lastNotificationFile, lastNotification, (err) => { 
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
console.log("------------------------------------------")
