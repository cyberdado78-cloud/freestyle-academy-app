/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const users = app.findCollectionByNameOrId('users');
  const collection = new Collection({
    type: 'base', name: 'prototype_states',
    listRule: "@request.auth.id != '' && owner = @request.auth.id",
    viewRule: "@request.auth.id != '' && owner = @request.auth.id",
    createRule: "@request.auth.id != '' && @request.body.owner = @request.auth.id",
    updateRule: "@request.auth.id != '' && owner = @request.auth.id && @request.body.owner:changed = false",
    deleteRule: "@request.auth.id != '' && owner = @request.auth.id",
    fields: [
      { name: 'owner', type: 'relation', collectionId: users.id, maxSelect: 1, required: true, cascadeDelete: true },
      { name: 'snapshot', type: 'json' },
      { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
      { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true }
    ]
  });
  app.save(collection);
}, (app) => { app.delete(app.findCollectionByNameOrId('prototype_states')); });
