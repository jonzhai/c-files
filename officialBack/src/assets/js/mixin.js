export const alertMixin = {
    methods: {
        myAlert(desc, callback, isSuccess) {
            let sence = isSuccess ? "Success" : "Error";
            this.$alert(desc, sence, {
                confirmButtonText: '确定',
                callback: action => {
                    if (callback) {
                        callback();
                    }
                }
            });
        },
    }
}