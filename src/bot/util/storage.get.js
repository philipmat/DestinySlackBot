export default get;

function get(context, id) {
    return new Promise((resolve, reject) => {
        context.get(id, (err, data) => {
            if(err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}