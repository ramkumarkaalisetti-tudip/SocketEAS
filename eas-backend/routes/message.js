const express = require('express');
const router = express.Router();

var fileSystem = require('fs'),
    path = require('path')
router.post('/easMessage', function(req,res){
    let alertMessage = req.body.alertMessage;
    let audioUrl = req.body.audioUrl;
    let messageFormat = {};
    alertMessage = alertMessage.toString();
    if(alertMessage) {
        messageFormat.msg_name = alertMessage.slice(0, 8);
        messageFormat.num_counties = alertMessage.slice(8, 10);
        var i;
        messageFormat.FIPS_code = [];
        var j = 10;
        for (i = 0; i < messageFormat.num_counties; i++) {
            messageFormat.FIPS_code[i] = alertMessage.slice(j, j + 6);
            j = j + 6;
        }
        messageFormat.org_time = alertMessage.slice(j, j = j + 7);
        messageFormat.duration = alertMessage.slice(j, j = j + 4);
        messageFormat.event_code = alertMessage.slice(j, j = j + 3);
        messageFormat.display_flag = alertMessage.slice(j, j = j + 1);
        messageFormat.audio_flag = alertMessage.slice(j, j = j + 1);
        messageFormat.display_length = alertMessage.slice(j, j = j + 4);
        messageFormat.audio_length = alertMessage.slice(j, j = j + 4);
        let display_len = parseInt(messageFormat.display_length,16);

        if(display_len && messageFormat.display_flag){
            messageFormat.display_content = alertMessage.slice(j, j = j + display_len);
        }
        let audio_len = parseInt(messageFormat.audio_length,16);
        if(audio_len && messageFormat.audio_length){
            messageFormat.audio_content = alertMessage.slice(j, j = j + display_len);
        }
    }
    let clients = global.clientsData;
    let io = req.app.get('socketio');

    if ( messageFormat.FIPS_code && messageFormat.num_counties === '00') {
        // It will send alert to all the connected users
        io.emit('new notification by FIPS', messageFormat, audioUrl);
    } else {
        if (clients && messageFormat && messageFormat.FIPS_code) {
            messageFormat.FIPS_code.forEach(function (FIPS_code) {
                clients.forEach(element => {
                    if (FIPS_code === element.FIPS_CODE.toString()) {
                        // It will send alert to end user with FIPS code
                        io.to(element.clientSocketId).emit('new notification by FIPS', messageFormat, audioUrl);
                    }
                })
            });
        }
    }

    res.statusCode = 200;
    res.json({ success: true, "message": 'message' });
})

module.exports = router;

