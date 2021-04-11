const axios = require('axios');
const http = require('http');
const fs = require('fs'),
const sound = require("sound-play");
request = require('request');

let alltheBirdies = [];

module.exports = {
  init: (country) => {

    axios.get(`https://www.xeno-canto.org/api/2/recordings?query=cnt:${country}&type=song`)
    .then(function (response) {

      response.data.recordings.forEach(bird => {

        let idCode = bird.sono.small.substring(
          bird.sono.small.lastIndexOf("ded/") + 4, 
          bird.sono.small.lastIndexOf("/ffts")
        );

        let file = "https://www.xeno-canto.org/sounds/uploaded/" + idCode + '/' + bird['file-name'];

        alltheBirdies.push({
          file: file,
          time: bird.time
        })
      })
    })
    .catch(function (error) {
      console.log(error);
    })
    .then(function () {
      let i = 0;

      setInterval(function(){ 
        module.exports.extractAudio(alltheBirdies[i].file, i)
        i++
      }, 4000);

    });
  },
  extractAudio: (url, idCode) => {
    request
    .get(url)
    .on('error', function(err) {
      throw err
    })
    .pipe(fs.createWriteStream(`birds/${idCode}.mp3`))
    .on('finish', function(){
      module.exports.playBirdie(idCode);
    });

  },
  playBirdie: async (i) => {
    sound.play(`./birds/${i}.mp3`);

  }

}

module.exports.init('netherlands');