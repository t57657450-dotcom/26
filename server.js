require("dotenv").config();

const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json({limit:"1mb"}));

app.use(express.static(__dirname));


app.post("/api/tts", async (req,res)=>{

try{

const {
text,
voiceId,
speed=1,
style=0
}=req.body;


if(!text){

return res.status(400).json({
error:"متن خالی است."
});

}


if(!process.env.ELEVENLABS_API_KEY){

return res.status(500).json({
error:"API Key تنظیم نشده است."
});

}


const response=await fetch(

`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,

{

method:"POST",

headers:{

"xi-api-key":
process.env.ELEVENLABS_API_KEY,

"Content-Type":
"application/json"

},

body:JSON.stringify({

text:text,

model_id:
"eleven_multilingual_v2",

voice_settings:{

stability:0.5,

similarity_boost:0.75,

style:Number(style),

speed:Number(speed),

use_speaker_boost:true

}

})

}

);


if(!response.ok){

const error=
await response.text();

return res.status(response.status)
.json({

error:error

});

}


const audio=
Buffer.from(
await response.arrayBuffer()
);


res.setHeader(
"Content-Type",
"audio/mpeg"
);


res.send(audio);


}catch(error){

console.error(error);

res.status(500).json({

error:"خطای سرور در ساخت صدا."

});

}

});


app.listen(PORT,()=>{

console.log(
`Voice Maker: http://localhost:${PORT}`
);

});
