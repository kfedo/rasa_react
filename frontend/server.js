var express= require('express');
var bodyParser = require("body-parser");
const axios = require('axios')

const app = express();
var path = require('path')
const server = require('http').createServer(app);
var cors = require('cors')
const PORT = 3000;



var build_path = __dirname;
app.use(cors())
app.use(express.static(path.join(build_path, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const fs = require('fs');
app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(build_path + '/build/index.html');
});

app.get('/mp3', (req, response) =>{

    axios.post('https://tts.outstep.com',
        {
            "voice": "gtts_file", "textToSpeech": "it seems to have worked just fine for me", "language": "en", "speed": "1"
        },
        {
            'Content-Type': 'application/json',
            responseType: "stream"
        })
        .then((res) => {
            console.log(`statusCode: ${res.status}`);
            // const path = path.resolve(__dirname, 'images', 'code.jpg')
            const path = "./build/static/media/sound.mp3";
            const writer = fs.createWriteStream(path);
            res.data.pipe(writer);
            response.status(200).send([])
        })
        .catch((error) => {
            console.error(error)
            response.status(200).send([])
        })

});
const getSound = async (text) =>{
    try {
        return await axios.post('https://tts.outstep.com',
            {
                "voice": "gtts_file", "textToSpeech": text, "language": "en", "speed": "1"
            },
            {
                'Content-Type': 'application/json',
                responseType: "stream"
            });
    } catch(error){
        console.error(error)
    }

}
const webhooks = async (q) => {
    try {
        // return await axios.post('http://localhost:5005/webhooks/rest/webhook',q);
        return await axios.post('http://scarlet_rasa:5005/webhooks/rest/webhook',q)
    } catch (error) {
        console.error(error)
    }
}

app.post('/rasa/webhooks/rest/webhook', function (req, res, next) {
    const isSound = req.body.isSound;
    webhooks(req.body).then(res1=>{
        // res.status(200).send(data.data);
        if(isSound && res1.data.length > 0){
            res1.data.forEach(element => {
                if(!element.hasOwnProperty('text')){
                    return;
                }
                getSound(element.text)
                    .then((res2) => {
                        console.log(`statusCode: ${res2.status}`);
                        const file_name = Date.now() + "__" + req.body.userId + ".mp3";
                        // const sound_link = "http://localhost:3000/static/audio/" +  file_name;
                        const sound_link = "/static/media/" +  file_name;
                        const path = "./build/static/media/" +  file_name;
                        try {
                            if (fs.existsSync(path)) {
                                fs.unlinkSync(path)
                            }
                        } catch(err) {
                            console.error(err)
                        }
                        const writer = fs.createWriteStream(path);
                        res2.data.pipe(writer).on('finish', function () {
                            element.link = sound_link;
                            res.status(200).send(res1.data);
                        });

                    })
                    .catch((error) => {
                        console.error(error)

                    })
            });


        } else {
            res.status(200).send(res1.data)
        }
    }).catch(err =>
        res.send(err)
    );

});

server.listen(PORT, () => console.log(`Listening on ${PORT}`));
