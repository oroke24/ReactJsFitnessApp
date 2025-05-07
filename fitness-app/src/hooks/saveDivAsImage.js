import html2canvas from "html2canvas";
const saveDivAsImage = (divId, name) =>{
    const element = document.getElementsByClassName(divId)[0];
    html2canvas(element,{
        backgroundColor: null
    }).then(canvas => {
        const imageUrl = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `${name}.png`
        link.click();
    });
}
export default saveDivAsImage;