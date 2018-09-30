export default {
    toPrecent: function(val) {
        return `${(val*100).toFixed(2)}`;
    },
    toDate3: function(val) {
        let date = new Date(val);
        return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
    },
    toDate: function(val) {
        let date = new Date(val);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    }
}