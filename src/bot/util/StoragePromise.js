export default class StoragePromise {
    constructor(controller) {
        this.teams = new StoragePromiseItem(controller, 'teams');
        this.channels = new StoragePromiseItem(controller, 'channels');
        this.users = new StoragePromiseItem(controller, 'users');
    }

    static init(controller) {
        return new StoragePromise(controller);
    }
}

let storagePromiseItemPrivateProps = new WeakMap();
class StoragePromiseItem {
    constructor(controller, group) {
        storagePromiseItemPrivateProps.set(this, {
            controller,
            group
        });
    }

    all() {
        let {controller, group} = storagePromiseItemPrivateProps.get(this);

        return new Promise((resolve, reject) => {
            controller.storage[group].all((err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    delete(id) {
        let {controller, group} = storagePromiseItemPrivateProps.get(this);

        return new Promise((resolve, reject) => {
            controller.storage[group].delete(id, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    get(id) {
        let {controller, group} = storagePromiseItemPrivateProps.get(this);

        return new Promise((resolve, reject) => {
            controller.storage[group].get(id, (err, data) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            })
        });
    }

    save(item) {
        let {controller, group} = storagePromiseItemPrivateProps.get(this);

        return new Promise((resolve, reject) => {
            controller.storage[group].save(item, (err) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(item);
                }
            });
        });
    }
}