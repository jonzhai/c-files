export default {
    toPrecent: function(val) {
        return `${(val*100).toFixed(2)}`;
    },
    toDate: function(val) {
        let date = new Date(val);
        return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()}`;
    },
    toDate2: function(val) {
        let date = new Date(val);
        return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}`;
    },
    toDate3: function(val) {
        let date = new Date(val);
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
    },
    toDecimal: function(val, num) {
        if (typeof val === "number") {
            return val.toFixed(num);
        } else {
            return val;
        }
    }
}