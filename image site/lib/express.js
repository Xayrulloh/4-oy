const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs')
const multiparty = require('multiparty')
const util = require('util')

const controllerFunctions = {}
const globalVariables = {}

async function Server (req, res) {
	const { pathname, query } = url.parse(req.url.toLowerCase(), true)
	const method = req.method.toUpperCase()

	req.query = query

	if(method != 'GET') {
		req.body = new Promise((resolve, reject) => {
			try {
				if(req.headers['Content-Type'] == 'application/json') {
					let str = ''
					req.on('data', chunk => str += chunk)
					req.on('end', chunk => resolve(JSON.parse(str)))
				} else {
					const form = new multiparty.Form({ uploadDir: path.join(process.cwd(), 'view') })

    				form.parse(req, function(err, fields, files) {
    				  	fields.file = files.file[0].path
    				  	resolve(fields)
    				})
				}
			} catch(error) {
				reject(error)
			}
		})
	}

	res.render = function (htmlFileName) {
		const file = fs.readFileSync(path.join(globalVariables['views'], htmlFileName + '.html' ))
		res.writeHead(200, { 'Content-Type': 'text/html' })
		return res.end(file)
	}

	res.json = function (data) {
		res.writeHead(200, { 'Content-Type': 'application/json' })
		return res.end(JSON.stringify(data))
	}

	if(controllerFunctions[method]?.[pathname]) {
		return controllerFunctions[method][pathname](req, res)
	} else {
		const extname = path.extname(pathname)
		const pathExists = fs.existsSync(path.join(globalVariables['static'] || '', pathname))

		if(!extname || !pathExists) return res.end(`Cannot ${method} ${pathname}`)

		const contentTypes = {
			'.html': 'text/html',
			'.txt': 'text/plain',
			'.css': 'text/css',
			'.js': 'application/js',
			'.json': 'application/json',
			'.zip': 'application/zip',
			'.pdf': 'application/pdf',
			'.xml': 'application/xml',
			'.mp3': 'audio/mp3',
			'.jpg': 'image/jpg',
			'.jpeg': 'image/jpeg',
			'.png': 'image/png',
			'.svg': 'image/svg+xml',
			'.mp4': 'video/mp4',
		}

		const contentType = contentTypes[extname] || 'application/octet-stream'

		res.writeHead(200, { 'Content-Type': contentType })
		return res.end(
			fs.readFileSync(path.join(globalVariables['static'], pathname))
		)
	}
}


class Express {
	constructor() {
		this.server = http.createServer(Server)
	}

	set(key, value) {
		globalVariables[key] = value
	}

	get(path, callback) {
		controllerFunctions['GET'] = controllerFunctions['GET'] || {}
		controllerFunctions['GET'][path] = callback
	}

	post(path, callback) {
		controllerFunctions['POST'] = controllerFunctions['POST'] || {}
		controllerFunctions['POST'][path] = callback
	}

	put(path, callback) {
		controllerFunctions['PUT'] = controllerFunctions['PUT'] || {}
		controllerFunctions['PUT'][path] = callback
	}

	delete(path, callback) {
		controllerFunctions['DELETE'] = controllerFunctions['DELETE'] || {}
		controllerFunctions['DELETE'][path] = callback
	}

	listen (PORT, callback) {
		return this.server.listen(PORT, callback)
	}
}

module.exports = Express
