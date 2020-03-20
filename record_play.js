javascript:(
  function(){
    const recordAudio = () =>
      new Promise(async resolve => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const audioChunks = [];

        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        const start = () => mediaRecorder.start();

        document.addEventListener('keyup', (event) => {
          console.log('stop');
          if(mediaRecorder.state === 'inactive') {
            return;
          }
          mediaRecorder.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            audio.play();
            audioChunks.length = 0;
          });

          mediaRecorder.stop();

        });

        resolve({ start });
      });

    const handle = async () => {
      const recorder = await recordAudio();
      document.addEventListener('keydown', (event) => {
        if(event.shiftKey){
          console.log('start');
          recorder.start();
        }
      });
    };
    handle();
})();
