//将对象属性添加至formdata
export const appendFormToFormData = (form, formdata) => {
    Object.entries(form).forEach(([key, value]) => {
        if (typeof value === "object") {
            value = JSON.stringify(value);
        }
        formdata.append(key, value);
    });
    return formdata;
}