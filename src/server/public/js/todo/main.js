function init(){
    const kanban = document.querySelector('.kanban');
    while(kanban.firstChild)
        kanban.removeChild(kanban.firstChild);

    new Kanban(document.querySelector('.kanban'));
}
init();