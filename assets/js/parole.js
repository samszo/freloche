export class parole {
    constructor(params={}) {
        var me = this;
        this.id = params.id ? params.id : "parole";
        this.conteneur = params.conteneur ? params.conteneur : d3.select("body");
        this.omk = params.omk ? params.omk : false;
        let record, stop, soundClips, canvas, mainSection, audioCtx, canvasCtx,
            frags = 1, durFrag = 180000,//3 minutes
            constraints = { audio: true },
            chunks = [], mediaRecorder, intervalId;

        this.init = function () {
            //ajoute le formulaire au conteneur
            let html = `
                <div id="formEnquete" class="visible">
                    <div class="row">
                        <div class="col">
                            <div class="input-group mb-3">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Choisir un enquêteur</button>
                                <ul id="lstEnqueteurs" class="dropdown-menu dropdown-menu-dark"
                                    style="overflow-y: scroll;height: 200px;">
                                </ul>
                                <input id="sltEnqueteur" type="text" class="form-control" aria-label="">
                            </div>
                                </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Choisir un interlocuteur</button>
                                <ul id="lstInterlocuteurs" class="dropdown-menu  dropdown-menu-dark"
                                style="overflow-y: scroll;height: 200px;"
                                >
                                </ul>
                                <input id="sltInterlocuteur" type="text" class="form-control" aria-label="">
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="input-group">
                                <span class="input-group-text">Long. Lat.</span>
                                <input type="text" id="inptLong" aria-label="longitudde" class="form-control">
                                <input type="text" id="inptLat" aria-label="latitude" class="form-control">
                                </div>
                        </div>
                        <div class="col">
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="inputGroup-sizing-default">Nom du lieu</span>
                                <input type="text" class="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default">
                            </div>                                
                        </div>
                    </div>
                    <div class="row">
                        <section class="main-controls">
                            <canvas class="visualizer" height="60px"></canvas>
                            <div id="buttons">
                                <button class="record">Record</button>
                                <button class="stop">Stop</button>
                            </div>
                            </section>
                    
                            <section class="sound-clips">
                            </section>                            
                    </div>
                </div>
            `;
            me.conteneur.html(html);
            getGeo();
            //gestion de l'enregistrement
            // https://github.com/mdn/dom-examples/blob/main/media/web-dictaphone/scripts/app.js
                        
            // Main block for doing the audio recording
            if (navigator.mediaDevices.getUserMedia) {
                console.log("The mediaDevices.getUserMedia() method is supported.");
                // Set up basic variables for app
                record = me.conteneur.select(".record").node();
                stop = me.conteneur.select(".stop").node();
                soundClips = me.conteneur.select(".sound-clips").node();
                canvas = me.conteneur.select(".visualizer").node();
                mainSection = me.conteneur.select(".main-controls").node();
                
                canvas.width = mainSection.offsetWidth-12;

                // Disable stop button while not recording
                stop.disabled = true;

                // Visualiser setup - create web audio api context and canvas
                canvasCtx = canvas.getContext("2d");                
                        
                navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
            } else {
                console.log("MediaDevices.getUserMedia() not supported on your browser!");
            }

        }

        let onError = function (err) {
            console.log("The following error occured: " + err);
        };
        let onSuccess = function (stream) {
            mediaRecorder = new MediaRecorder(stream);
    
            visualize(stream);
        
            record.onclick = function () {
                startRecord();
                saveRecord();
            };
        
            stop.onclick = function () {
                stopRecord();
                clearInterval(intervalId);    
            };
        
            mediaRecorder.onstop = function (e) {
                saveSound();
            };
        
            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            };                
        };      
        

        function startRecord(){
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("Recorder started.");
            record.style.background = "red";
        
            stop.disabled = false;
            record.disabled = true;
        }
        function stopRecord(){
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("Recorder stopped.");
            record.style.background = "";
            record.style.color = "";
            stop.disabled = true;
            record.disabled = false;
        }        
        function saveRecord(){
            //enregistre toutes les durFrag
            intervalId = setInterval(recordStopStart, durFrag);
        }
        function recordStopStart(){
            stopRecord();
            startRecord();
        }

        function saveSound(){
            const clipContainer = document.createElement("article");
            const clipLabel = document.createElement("p");
            const audio = document.createElement("audio");
            const deleteButton = document.createElement("button");
        
            clipContainer.classList.add("clip");
            audio.setAttribute("controls", "");
            deleteButton.textContent = "Delete";
            deleteButton.className = "delete";
        
            clipLabel.textContent = "Fragment "+frags;
            frags ++;
        
            clipContainer.appendChild(audio);
            clipContainer.appendChild(clipLabel);
            clipContainer.appendChild(deleteButton);
            soundClips.appendChild(clipContainer);
        
            audio.controls = true;
            const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
            chunks = [];
            const audioURL = window.URL.createObjectURL(blob);
            audio.src = audioURL;
            console.log("recorder stopped");
        
            saveToOmk(blob, mediaRecorder.mimeType);
        
            deleteButton.onclick = function (e) {
                e.target.closest(".clip").remove();
            };
        
            clipLabel.onclick = function () {
                const existingName = clipLabel.textContent;
                const newClipName = prompt("Enter a new name for your sound clip?");
                if (newClipName === null) {
                clipLabel.textContent = existingName;
                } else {
                clipLabel.textContent = newClipName;
                }
            };     
            
        }        

        //gestion des positions
        const optGeo = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        };
        
        function successGeo(pos) {
            const crd = pos.coords;
            me.conteneur.select("#inptLong").attr('value',crd.longitude); 
            me.conteneur.select("#inptLat").attr('value',crd.latitude); 
        }
        
        function errorGeo(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        function getGeo(){
            navigator.geolocation.getCurrentPosition(successGeo, errorGeo, optGeo);
        }
  
    function visualize(stream) {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
    
        const source = audioCtx.createMediaStreamSource(stream);
    
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
    
        source.connect(analyser);
    
        draw();
    
        function draw() {
            const WIDTH = canvas.width;
            const HEIGHT = canvas.height;
        
            requestAnimationFrame(draw);
        
            analyser.getByteTimeDomainData(dataArray);
        
            canvasCtx.fillStyle = "rgb(200, 200, 200)";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
        
            canvasCtx.lineWidth = 2;
            canvasCtx.strokeStyle = "rgb(0, 0, 0)";
        
            canvasCtx.beginPath();
        
            let sliceWidth = (WIDTH * 1.0) / bufferLength;
            let x = 0;
        
            for (let i = 0; i < bufferLength; i++) {
                let v = dataArray[i] / 128.0;
                let y = (v * HEIGHT) / 2;
        
                if (i === 0) {
                canvasCtx.moveTo(x, y);
                } else {
                canvasCtx.lineTo(x, y);
                }
        
                x += sliceWidth;
            }
        
            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        }
    }
    
    /**merci à  https://franzeus.medium.com/record-audio-in-js-and-upload-as-wav-or-mp3-file-to-your-backend-1a2f35dea7e8
     * Uploads audio blob to your server
     * @params {Blob} audioBlob - The audio blob data
     * @params {string} fileType - 'mp3' or 'wav'
     * @return {Promise<object>)
     */
    async function saveToOmk(audioBlob, fileType){
        if(!me.omk)return;
        let data = {
            "dcterms:title":"test", 
            "file":1, 
        };
        //save image to omeka
        me.omk.createItem(data,i=>{
            console.log(i);
        },false,audioBlob);    
    
    }
  

        this.init();
    }
}

