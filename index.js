const fs = require('fs')
const express = require('express')
const app = express()
const puerto = 8080

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName
    }
    async save(objeto) {
        try{
            let arr = []
            let data = await fs.promises.readFile(`productos.txt`, 'utf-8')
            if(!data) {
                console.log(data)
                objeto.id = 1
                arr = [objeto]
                await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(arr,"\n"))
                console.log( objeto.id)
                return objeto.id
            } else {
                arr = JSON.parse(data);
                objeto.id = arr.length + 1
                arr.push(objeto)
                await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(arr))
                console.log( objeto.id)
                return objeto.id
            }
        }catch(e){
            console.log("Error: ", e)
        }
    }
    async getById(id){
        try{
            let arr = []
            const data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')
            arr = JSON.parse(data);
            const indexList = []
            arr.forEach((objeto) =>{
                indexList.push(objeto.id)
            })
            console.log(indexList)
            const index = indexList.indexOf(id)
            if(index>=0){
                console.log(arr[index])
                return arr[index] 
            }
            else{
                console.log(null)
                return null
            }
        }catch(e){
            console.log("Error: ", e)
        }
    }
    async getAll(){
        try{
            let arr = []
            const data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')
            arr = JSON.parse(data);
            const objetList = await fs.promises.readFile(`./${this.fileName}`,'utf-8')
            console.log(JSON.parse(objetList))
            return JSON.parse(objetList)
        }catch(e){
            console.log("Error: ",e)
        }
    }
    async deleteById(id){
        try{
            let arr = []
            const data = await fs.promises.readFile(`./${this.fileName}`, 'utf-8')
            arr = JSON.parse(data);
            const indexList = []
            arr.forEach((objeto) =>{
                indexList.push(objeto.id)
            })
            console.log(indexList)
            const index = indexList.indexOf(id)
            console.log(index)
            if(index>=0){
                arr.splice(index,1)
                console.log("Objeto eliminado con exito")
                await fs.promises.writeFile(`./${this.fileName}`, JSON.stringify(arr,"\n"))
            }
            else{
                console.log("Ese Id no corresponde a ningun objeto")
            }
        }catch(e){
            console.log("Error: ", e)
        }
    }
    async deleteAll(){
        try{
            await fs.promises.writeFile(`./${this.fileName}`, "[]")
            console.log("Todos los objetos fueron eliminados con exito.")
        }catch(e){
            console.log("Error: ",e)
        }
    }
}


const contProductos = new Contenedor("productos.txt")

app.get('/', (req,res)=>{
    res.status(200).send('Hola soy ruta home')
})

app.get('/productos', (req,res)=>{

    contProductos.getAll()
    .then(x=>res.send(x))
    
}) 
app.get('/productoRandom', (req,res)=>{ 
    contProductos.getAll()
    .then(x => {
        const length = x.length
        const randomNumber = Math.floor(Math.random() * length)
        return x[randomNumber]
    })
    .then(x=>res.send(x))
})

app.listen(puerto, ()=>{
    console.log(`Servidor escuchando puerto ${puerto}`)
})