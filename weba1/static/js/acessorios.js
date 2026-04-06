Sortable.create(demo1, {
    animation: 100,
    group: 'list-1',
    draggable: '.list-group-item',
    handle: '.list-group-item',
    sort: true,
    filter: '.sortable-disabled',
    chosenClass: 'active'
});

Sortable.create(demo2, {
    group: 'list-1',
    handle: '.list-group-item'
});