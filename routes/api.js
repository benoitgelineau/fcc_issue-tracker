/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectID;


module.exports = function (app, db) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      
      db.collection(project).find();
    })
    
    .post(function (req, res, next){
      var project = req.params.project;
      
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
          if (data.insertedCount === 1) res.send(`New issue created with id: ${data.insertedId}`);
        }
      );
    })
    
    .put(function (req, res){
      var project = req.params.project;
      let objForUpdate = {};

      if (req.body.issue_title) objForUpdate.issue_title = req.body.issue_title;
      if (req.body.issue_text) objForUpdate.issue_text = req.body.issue_text;
      if (req.body.created_by) objForUpdate.created_by = req.body.created_by;
      if (req.body.assigned_to) objForUpdate.assigned_to = req.body.assigned_to;
      if (req.body.status_text) objForUpdate.status_text = req.body.status_text;
      if (req.body.open) objForUpdate.open = false;

      // Check for empty fields
      if (Object.keys(objForUpdate).length === 0) {

        res.send('no updated field sent');

      } else {

        objForUpdate.updated_on = new Date();
        
        db.collection(project).findAndModify(
          { _id: ObjectId(req.body._id) }, 
          {},
          { $set: objForUpdate },
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
      
      if (!req.body._id) res.send('_id error');

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

          res.send(message);
        }
      )
    })
    
};
