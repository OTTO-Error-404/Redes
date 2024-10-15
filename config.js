import express from 'express' // Importo el módulo de express que me sirve para facilitarme la creación de un servidor, para instalarlo: npm i express
import morgan from 'morgan' // Solo instalar en modo de desarrollo, eliminar en modo de producción, da información de todas las conexiones entrantes , para instalar : npm i morgan
import  hbs  from "hbs" // Importo el módulo de HBS para el motor de plantillas
import { fileURLToPath } from "url" // para obtener las rutas del archivo actual
import { dirname } from "path"
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)


const servidor = express() // ejecuto la función de express

servidor.set('puerto', process.env.PORT || 80 || 8080) // Defino una configuración en el servidor que me crea una variable puerto que puede tomar el valor de una variable PORT si está definida como variables de entorno, sino usa el puerto 80 o sino el 8080
servidor.use(express.json()) // .use es un middleware o intermediario, se ejecuta antes de las rutas de la aplicación, en este caso le pido al servidor que va a recibir la información desde el servidor express en formato json
servidor.use(morgan('dev'))//.use es un middleware o intermediario, se ejecuta antes de las rutas de la aplicación, le pido que me muestre todas las conexiones, puedo ver las rutas a las que se quiere acceder
servidor.use(express.static(`${__dirname}/publicos`)) // Establece los archivos estáticos que quiero compartir con el usuario, el resto  de los archivos del servidor no se pueden ver desde el frontend
servidor.set("view engine","hbs") // Voy a establecer mi motor de plantillas de Handlebars
hbs.registerPartials(`${__dirname}/views/partials`) // Creo la ruta de mis partials para reutilizar los componentes que voy a crear
servidor.listen(servidor.get("puerto"))
export {
    servidor // exporto la configuración completa de mi servidor
}
