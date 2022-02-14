class KanbanAPI {
    static async getItems(columnId){
        const data = await read();
        if(data.error) return [];
        const column = data.find(column => column.id == columnId);
        if(!column) return [];
        return column.items;
    }

    static async insertItem(columnId, content){
        const data = await read();
        const column = data.find(column => column.id == columnId);
        const item = {
            id: Math.floor(Math.random() * 100000),
            content
        };
        if(!column){
            throw new Error("Column does not exist.");
        }
        column.items.push(item);
        await save(data);

        return item;
    }

    static async updateItem(itemId, newProps){
        const data = await read();
        let item = null;
        let column = null;

        for(let i = 0; i < data.length; i++) {
            const _column = data[i];
            const _item = _column.items.find(_i => _i.id == itemId);

            if (_item) {
                item = _item;
                column = _column;
                break;
            }
        }

        if(!item) {
            throw new Error("Item not found.");
        }

        item.content = newProps.content === undefined ? item.content : newProps.content;

        if(newProps.columnId !== undefined && newProps.position !== undefined){
            const targetColumn = data.find(column => column.id == newProps.columnId);

            if(!targetColumn){
                throw new Error("Target column not found.");
            }

            column.items.splice(column.items.indexOf(item), 1);
            targetColumn.items.splice(newProps.position, 0, item);
        }

        await save(data);
    }

    static async deleteItem(itemId){
        const data = await read();

        for(const column of data){
            const item = column.items.find(item => item.id == itemId);
            if(item){
                column.items.splice(column.items.indexOf(item), 1);
            }
        }
        await save(data);
    }
}

async function read() {
    const projectId = window.location.href.split('project/')[1].split('/')[0];

    const f = await fetch('/api/todo_data', {
        method: "GET",
        headers: {
            projectId: projectId
        }
    });
    const j = await f.json();
    return j;
}

async function save(data){
    const projectId = window.location.href.split('project/')[1].split('/')[0];
    const f = await fetch('/api/set_todo', {
        method: "GET",
        headers: {
            projectId: projectId,
            data: JSON.stringify(data)
        }
    });
    const j = await f.json();
}