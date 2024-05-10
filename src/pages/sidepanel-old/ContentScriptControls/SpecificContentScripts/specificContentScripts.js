export function youtubeWatchScript(request){
    console.log("HI!!!")
    let isBlurred = false;

    switch (request.action) {
        case 'focus':
            isBlurred = !isBlurred;
            toggleBlur(isBlurred);
            break;
        case 'initialize':
            toggleBlur(isBlurred);
            break;
        case 'mutationDetected':
            toggleBlur(isBlurred);  // Optionally re-apply blur based on mutations
            break;
        case 'cleanup':
            cleanupEffects();
            break;
        default:
            console.log('Unhandled request:', request);
            break;
    }


    function toggleBlur(blurState) {
        const elements = [document.getElementById('below'), document.getElementById('secondary')];
        elements.forEach(elem => {
            if (elem) {
                elem.style.filter = blurState ? 'blur(20px)' : 'none';
            }
        });
    }

    function cleanupEffects(){
        const elements = [document.getElementById('below'), document.getElementById('secondary')];
        elements.forEach(elem => {
            if (elem) {
                elem.style.filter = 'none'; // Remove any styles
            }
        });

    };
};


function instagramScript(request){

}

