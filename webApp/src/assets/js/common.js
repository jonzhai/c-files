// document.addEventListener('DOMContentLoaded', function() {
//     document.addEventListener('touchmove', function(e) {
//         e.preventDefault();
//     }, false)
// }, false)

window.addEventListener('orientationchange', function(e) {

})


export const Alert = (desc) => {
    let temp = document.querySelector('#my-alert');
    if (temp) {
        document.body.removeChild(temp);
    }
    return new Promise((resolve, reject) => {
        let wrapper = document.createElement('div');
        wrapper.id = "my-alert";

        let alert = document.createElement('div');
        alert.className = "alert";

        wrapper.appendChild(alert);


        let content = document.createElement('div');
        content.className = "content";

        content.innerText = desc;
        alert.appendChild(content);
        let operate = document.createElement('div');
        operate.className = "operate";


        let span1 = document.createElement('span');
        span1.innerText = '取消';
        span1.onclick = cancel;
        let span2 = document.createElement('span');

        span2.innerText = '确定';
        span2.onclick = confirm;
        operate.appendChild(span1);
        operate.appendChild(span2);
        alert.appendChild(operate);

        function cancel() {
            document.body.removeChild(wrapper);
            reject();
        }

        function confirm() {
            document.body.removeChild(wrapper);
            resolve();
        }

        document.body.appendChild(wrapper);
    })
}
export const Toast = (desc, delay) => {
    let temp = document.querySelector('#toast');
    if (temp) {
        document.body.removeChild(temp);
    }
    let wrapper = document.createElement('div');
    wrapper.id = "toast";
    // let str = `<p>${desc}</p>`;
    wrapper.innerText = desc;
    document.body.appendChild(wrapper);
    if (!delay) {
        delay = 1000;
    }
    setTimeout(() => {
        document.body.removeChild(wrapper);
    }, delay)
}