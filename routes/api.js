/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var ObjectId = require('mongodb').ObjectID;


module.exports = function (app, db) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      const fields = ['_id', 'issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'created_on', 'updated_on', 'open'];
      let queries = {};

      fields.map(field => {
        if (req.query[field]) {
          if (field === '_id') {
            queries[field] = ObjectId(req.query[field]);
          } else if (field === 'open') {
            queries[field] = req.query[field] === 'true';
          } else {
            queries[field] = req.query[field];
          }
        };
      });
      
      db.collection(project)
        .find(queries)
        .toArray((err, data) => res.send(data));
    })
    
    .post(function (req, res){
      var project = req.params.project;
      
      if (!req.body.issue_title ||
          !req.body.issue_text ||
          !req.body.created_by) {

        res.json({ msg: 'Fields required' });

      } else {

        db.collection(project).insertOne(
          {
            issue_title: req.body.issue_title,
            issue_text: req.body.issue_text,
            created_on: new Date(),
            updated_on: new Date(),
            created_by: req.body.created_by,
            assigned_to: req.body.assigned_to || '',
            open: true,
            status_text: req.body.status_text || ''
          },
          (err, data) => {
  
            if (data.insertedCount === 1) {
              res.json({ issue_title: data.ops[0].issue_title, issue_text: data.ops[0].issue_text, created_on: data.ops[0].created_on, updated_on: data.ops[0].updated_on, created_by: data.ops[0].created_by, assigned_to: data.ops[0].assigned_to, open: data.ops[0].open, status_text: data.ops[0].status_text, msg: 'New issue created' });
            }
          }
        );
      }
    })
    
    .put(function (req, res){
      var project = req.params.project;
      let updates = {};

      if (req.body.issue_title) updates.issue_title = req.body.issue_title;
      if (req.body.issue_text) updates.issue_text = req.body.issue_text;
      if (req.body.created_by) updates.created_by = req.body.created_by;
      if (req.body.assigned_to) updates.assigned_to = req.body.assigned_to;
      if (req.body.status_text) updates.status_text = req.body.status_text;
      if (req.body.open) updates.open = false;

      // Check for empty fields
      if (Object.keys(updates).length === 0) {

        res.send('no updated field sent');

      } else {

        updates.updated_on = new Date();
        
        db.collection(project).findAndModify(
          { _id: ObjectId(req.body._id) }, 
          {},
          { $set: updates },
          (err, data) => {

            let message;
            // Check for existing _id
            if (data.lastErrorObject.updatedExisting) {
              message = "successfully updated";
            } else {
              message = `could not update ${req.body._id}`;
            }

            res.send(message);
          }
        )
      }
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      
      if (!req.body._id) res.json({ msg: '_id error' });

      db.collection(project).deleteOne(
        { _id: ObjectId(req.body._id) },
        {},
        (err, data) => {

          let message;
          // Check for existing _id
          if (data.deletedCount < 1) {
            message = `could not delete ${req.body._id}`;
          } else {
            message = `deleted ${req.body._id}`;
          }

          res.json({ 
            id: req.body._id,
            msg: message
          });
        }
      )
    })
    
};
