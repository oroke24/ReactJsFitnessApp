const copyToClipboard = (...args) => {
    let textToCopy = "";
    args.forEach((arg, index) =>{
        textToCopy +=  `${arg}\n`
    });

    navigator.clipboard.writeText(textToCopy)
    .then(() =>{
        alert('Copied to clipboard');
    })
    .catch((err)=>{
        console.error('Failed to copy text: ', err);
        alert('Failed to copy text.');
    });
}
export default copyToClipboard;