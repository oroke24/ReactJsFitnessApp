import html2canvas from "html2canvas";

const copyDivImageToClipboard = (divId) => {
    try{
    const isAppleDevice = () => {
        const userDevice = navigator.userAgent.toLowerCase();
        if(/iphone|ipod|ipad/.test(userDevice)){
            return true;
        }
        if(/macintosh|mac os x/.test(userDevice)){
            return true;
        }
        return false;
    };


    console.log("window.clipBoardItem: ", window.ClipboardItem);
    if(!navigator.clipboard || !window.ClipboardItem){
        alert("Clipboard API not supported in this browser.");
    }
    navigator.permissions.query({name: "clipboard-write"})
        .then((permissionStatus) =>{
            if(permissionStatus.state === "denied"){
                alert("Clipboard image access is denied. (Common issue with Apple devices. Working on fix...).");
                return;
            }
    });
    const element = document.getElementsByClassName(divId)[0];
    html2canvas(element,{
        backgroundColor: null
    }).then(canvas => {
        canvas.toBlob(blob => {
            const item = new ClipboardItem({"image/png": blob });
            fallbackSaveToPhotos(blob);
            navigator.clipboard.write([item]).then(() => {
                //alert("Copied card to clipboard");
            }).catch(err => {
                if(isAppleDevice()){fallbackSaveToPhotos(blob)}
                else console.error("Failed to copy image to clipboard: ", err);
            });
        }, "image/png");
    });
    }catch(error){console.error("Error copying image: ", error)}
};

const fallbackSaveToPhotos = (blob) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();
    image.src = url;
    image.alt = "Image to save to Photos app";

    const closeButton = document.createElement("button");
    closeButton.textContent ="close";
closeButton.classList.add("absolute", "top-3", "right-3");

    const div = document.createElement("div");
    div.style.backgroundColor = "#222222AA";
    div.style.borderRadius = "8px";
    div.style.color ="white";
    div.style.position = "fixed";
    div.style.top = "50%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.padding = "20px";
    div.style.paddingTop = "15%";
    div.style.boxShadow = "0 0 100px rgba(0, 0, 0, 0.5)";
    div.style.textAlign = "center";
    div.style.minHeight = "50%";
    div.style.width = "85%";
    div.style.height = "auto";
    div.style.maxHeight = "100%";
    div.style.overflowY = "scroll";

    const text = document.createElement("p");
    text.textContent = `Mobile: Tap and hold to see options.\nDesktop: Drag or right click.`

    div.appendChild(closeButton);
    div.appendChild(text);
    div.appendChild(image);
    document.body.appendChild(div);

    closeButton.addEventListener("click", ()=>{div.remove()})
    
    const handleClickOutside = (event) =>{
        if(!div.contains(event.target)){
            div.remove();
            document.removeEventListener("click", handleClickOutside);
        }
    };
    document.addEventListener("click", handleClickOutside);
};
export default copyDivImageToClipboard;