export default save;

function save(context, toSave) {
    return new Promise((resolve, reject) => {
        context.save(toSave, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve(toSave);
            }
        })
    })
}