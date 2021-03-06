const router = require('express').Router()
const Project = require('../models/project.model')

// Returns all projects associated with a specific username.
router.route('/getinfo').get((req, res) => {
  Project.find({ username: req.session.username })
    .then(projects => res.json(projects))
    .catch(err => res.status(400).json('Error: ' + err))
})

// Add project function, the project object is created using the following parameters that are passed through the request body
router.route('/add').post((req, res) => {
  const username = req.body.username
  const status = req.body.status
  const projectName = req.body.projectName
  const submissionDate = Date.parse(req.body.submissionDate)
  const attachments = req.body.attachments
  const karmaPoints = Number(req.body.karmaPoints)
  const communicationPoints = Number(req.body.communicationPoints)
  const projectPoints = Number(req.body.projectPoints)
  const isGraded = req.body.isGraded

  const newProject = new Project({
    username,
    status,
    projectName,
    submissionDate,
    attachments,
    karmaPoints,
    communicationPoints,
    projectPoints,
    isGraded
  })

  newProject.save()
    .then(() => res.json('Project added!'))
    .catch(err => res.status(400).json('Error: ' + err))
})

// Recieving the uploaded file and saving it in any desired directory.
router.route('/upload-file').post((req, res) => {
  var file = req.files.file
  console.log(file)
  file.mv('../backend/storage/' + file.name, function(err){
    if(err){
      res.json({"status":"file not uploaded"})
    }
    else{
      res.json({"status":"file has been uploaded"})
    }
  })
})

// Checks if the file had uploaded before or not.
// If yes, it does not duplicate its name in the DB.
// Otherwise, it appends to the attachments array and upadates the DB.
router.route('/submit-files/:id').post((req, res) => {   
  Project.findById(req.params.id)
    .then(project => {
      if (project.attachments.indexOf(req.body.attachment) == -1) {
        project.attachments = project.attachments.concat(req.body.attachment);
        project.save()
        .then(() => res.json('Attachments updated!'))
        .catch(err => res.status(400).json('Error: ' + err));
      }
    })
    .catch(err => res.status(400).json('Error: ' + err));
})

module.exports = router
