// let validateLogin = {
//     validate_phone(e) {
//         var value = e.target.value;

//     }
// }
//弹出层mixin
export const ToastMixin = {
    data() {
        return {
            descText: '',
            showToast: false,
        }
    },
    methods: {
        toast(text) {
            this.descText = text;
            this.showToast = true;
        },
        closeToast() {
            this.showToast = false;
        }

    }
}