class ItemService {
    constructor(model) {
        this.Model = model;
    }
    async getItems(options = {}, skip = 0, limit = 2) {
        return await this.Model.find(options)
            .sort({ created_at: -1 })
            .skip(skip)
            .limit(limit);
    }
    async getSingleItem(id) {
        return await this.Model.findOne({ _id: id });
    }
    async createItem(data) {
        return await this.Model.create(data);
    }
    async removeItem(id) {
        return await this.Model.findByIdAndRemove(id);
    }
    async updateItem(id, content) {
        let doc = await this.Model.findByIdAndUpdate(id, content, {
            useFindAndModify: false,
            new: true,
        });
        return doc;
    }
}

module.exports = ItemService;
