/* Evaluate and run programs */
//Modules

var exec = require('child_process').exec,
  path = require('path'),
  fs = require('fs');

module.exports.execute = function(filename, dirname, labname, callback){
  var folder_path = path.join(__dirname, '../storage/' + dirname)
  var type = getLanguage(filename);
  if (type === 'python') executePython(folder_path, filename, labname, callback);
  else if (type === 'java') executeJava(folder_path, filename, labname, callback);
  else if (type === 'cpp') executeCPlusPlus(folder_path, filename, labname, callback);
};  

function diff (err, stdout, stderr, folder_path, labname, callback){
  if (err) callback(err, stdout, stderr);
  else if (stderr) callback(err, stdout, stderr);
  else {
    console.log('doing the diff!');
    fs.writeFile(path.join(folder_path, 'tmp_diff_file'), stdout, function(err){
      console.log('stdout: ', stdout);
      if (err) callback(err);
      else {
        var expectedPath = path.join(__dirname, '../labs', labname, labname + '.out');
        console.log(expectedPath);
        var diff_command = 'diff -b -i ' + expectedPath + ' ' + path.join(folder_path, 'tmp_diff_file');
        exec(diff_command, function(diff_err, diff_stdout, diff_stderr){
          if(diff_err) console.log('ERROR RUNNING THE DIFF COMMAND:', diff_err);
          fs.unlink(path.join(folder_path, 'tmp_diff_file'), function(err){
            if (err) console.log(err);
            else callback(err, stdout, stderr, diff_stdout);
          });
        });
      }
    });
  }
}

function getLanguage(filename){
  filename_split = filename.split('.');
  if (filename_split.length === 1 || filename_split[1] === 'py') return 'python';
  else if (filename_split[1] === 'java') return 'java';
  else if (filename_split[1] === 'cpp') return 'cpp';
}

function executeJava(folder_path, filename, labname, callback){
  var compile_command = 'javac ' + folder_path + '/' + filename;
  exec(compile_command, function(err, stdout, stderr){
    if(err) callback(err);
    else{
      var rfilename = filename.substring(0, filename.indexOf("."));
      var run_command = 'java -cp ' + path.join(folder_path, rfilename) + ' > ';
      exec(run_command, function(err, stdout, stderr){
        if (err) callback(err);
        else diff(err, stdout, stderr, folder_path, labname, callback);
      });
    }
  });
};

function executePython(folder_path, filename, labname, callback){
  console.log('Executing python');
  var run_command = 'python ' + folder_path + '/' + filename;
  exec(run_command, function(err, stdout, stderr){
    console.log('run_command: ', run_command);
    if (err) callback(err);
    else diff(err, stdout, stderr, folder_path, labname, callback);
  });
}

function executeCPlusPlus(folder_path, filename, labname, callback){
  var compile_command = 'g++ ' + folder_path + '/' + filename + ' -o ' + folder_path + '/a.out';
  exec(compile_command, function(err, stdout, stderr){
    if(err) callback(err);
    else{
      var run_command = folder_path + '/./a.out';
      exec(run_command, function(err, stdout, stderr){
        if (err) callback(err);
        else diff(err, stdout, stderr, folder_path, labname, callback);
      });
    }
  });
}
