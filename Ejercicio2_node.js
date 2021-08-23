const http = require('http')
const {promises: {readFile}} = require("fs");
const axios = require('axios');

const port = 8081


axios.get('https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json')
    .then(pro => 
        axios.get('https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json')
        .then( cli => createTables(pro.data, cli.data)))
            

function createTables(pro, cli)
{
    readFile('index.html').then( file =>
    { 
        let html = file.toString()
        html = html.split('<tbody>')
        let cliHead = html[0]
        let proHead = cliHead
        let bottom = html[1]
        pro.forEach((value, index, array) => 
        {
            let row = '<tr>\n'
            row += '<td>' + value.idproveedor +'</td>\n'
            row += '<td>' + value.nombrecompania +'</td>\n'
            row += '<td>' + value.nombrecontacto +'</td>\n'
            row += '</tr>\n'
            proHead += row
        })
        let proHtml = proHead + bottom

        cli.forEach((value, index, array) => 
        {
            //console.log(value)
            let row = '              <tr>\n'
            row += '                <td>' + value.idCliente +'</td>\n'
            row += '                <td>' + value.NombreCompania +'</td>\n'
            row += '                <td>' + value.NombreContacto +'</td>\n'
            row += '              </tr>\n'
            cliHead += row
        })
        let cliHtml = cliHead + bottom
        //console.log(cliHtml)
        startServer(proHtml, cliHtml)
    })
}

function startServer(pro, cli)
{
    const server = http.createServer(
        (req, res) => {
            let dir = req.url
            
            console.log('dir:'+dir)
            if (dir != undefined)
            {
                res.writeHead(200, {'Content-Type':'text/html'})
                if (dir == '/api/proveedores')
                {
                    res.write(pro)
                }
                else if(dir == '/api/clientes')
                {
                    res.write(cli)
                }
                res.end()
            }
            else {
                res.writeHead(200, {'Content-Type':'text/html'})
                res.write('Se jodio esta vaina')
                res.end()
            }
            
        }
    )

    server.listen(port, error => 
        {
            if (error)
            {
                console.log(error)
            } 
            else
            {
                console.log('nice')
            }
        })
}
