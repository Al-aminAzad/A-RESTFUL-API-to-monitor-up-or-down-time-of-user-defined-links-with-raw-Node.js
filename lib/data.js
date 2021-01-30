/*
 *Title : Uptime Monitoring Application
 *Description : A RESTFUL API to monitor up or down time of user defined links
 *Author : Al-amin
 *Credit : Sumit Saha
 *Date : 01/25/2021
 */

 //dependencies

 const fs =require('fs');
 const path = require('path');

 //module scaafolding

 const lib={};

 lib.basedir = path.join(__dirname,'/../.data/'); 
 //console.log(`lib.basedir = ${lib.basedir}`);

 //write data to file
 lib.create = (dir,file,data,callback) =>{
     //open file for writing
     fs.open(`${lib.basedir + dir}/${file}.json`,'wx',(err,fileDescriptor)=>{
         //console.log(`File descriptor = ${fileDescriptor}`);
         if(!err && fileDescriptor){
             //convert data to string
             const srtingData = JSON.stringify(data);
             fs.writeFile(fileDescriptor,srtingData,(err2)=>{
                 if(!err2){
                     fs.close(fileDescriptor,(err3)=>{
                         if(!err3){
                             callback(false)
                         }else{
                             callback('error closin the new file');
                         }
                     });
                 }else{
                     callback('error writing to new file');
                 }
             });
         }else{
             callback('Could not create new file. It may already exists!');
         }
     });
 };
lib.read = (dir,file,callback)=>{
    fs.readFile(`${lib.basedir + dir}/${file}.json`,'utf8',(err,data)=>{
        callback(err,data);
    });
};

lib.update = (dir,file,data,callback)=>{
    fs.open(`${lib.basedir + dir}/${file}.json`,'r+',(err,fileDescriptor)=>{
        if(!err && fileDescriptor){
            const stringData= JSON.stringify(data);
            //truncate the file
            fs.ftruncate(fileDescriptor,(err1)=>{
                if(!err1){
                    //write to the file and close
                    fs.writeFile(fileDescriptor,stringData,(err2)=>{
                        if(!err2){
                            fs.close(fileDescriptor,(err3)=>{
                                if(!err3){
                                    callback(false);
                                }else{
                                    callback('Error closing file')
                                }
                            })
                        }else{
                            callback('Error writing to file')
                        }
                    })

                }else{
                    callback('Error truncating the file');
                }
            })

        }else{
            callback('Error updating file. it may exists!')
        }
    });
};

lib.delete = (dir,file,callback)=>{
    //unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`,(err)=>{
        if(!err){
            callback(false);
        }else{
            callback('Error deleting');
        }
    });
};

//list all the items in a directory
lib.list = (dir,callback)=>{
    fs.readdir(`${lib.basedir + dir}/`,(err,fileNames)=>{
        if(!err && fileNames && fileNames.length >0){
            let trimmedFileNames = [];
            fileNames.forEach(fileName =>{
                trimmedFileNames.push(fileName.replace('.json',''));
            });
            callback(false,trimmedFileNames);
        }else{
            callback('Error reading directory')
        }
    });
}
 module.exports=lib;