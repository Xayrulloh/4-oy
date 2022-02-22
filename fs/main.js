/*let fs = require('fs'),
allFiles = [
            'tool.js',
            {
                src: [
                    { 
                        lib: ['postgres.js', 'jwt.js'] 
                    },
                    { 
                        controllers: ['user.js'] 
                    },
                    { 
                        routes: ['user.js'] 
                    },
                    'server.js',
                    'context.js'
                ],
            },
            'config.js'
]

function recursive(files, path = "./") {
    for(let file in files){
        if(typeof files[file] == "object"){
            for(let i in files[file]){
                fs.mkdirSync(`${path}/` + i, {recursive: true, force: true});
                recursive(files[file][i], `${path}/${i}`)
            }          
        }
        else fs.writeFile(`${path}/` + files[file], "", (err) => console.log(err))
    }
}

recursive(allFiles)*/