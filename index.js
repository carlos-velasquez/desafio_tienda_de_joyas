const { obtenerJoyas, obtenerJoyasPorFiltro, prepararHATEOAS, middleware } = require('./consulta');
const express = require('express');

const app = express();

app.use(express.json());

app.listen(3000, console.log('servidor encendido'));

app.get('/inventario', middleware, async (req,res) => {
    const consulta = req.query;
    const inventario = await obtenerJoyas(consulta);
    const HATEOAS = await prepararHATEOAS(inventario);
    res.json(HATEOAS);
})

app.get('/inventario/filtros', async (req, res) => {
    const consulta = req.query;
    const inventario = await obtenerJoyasPorFiltro(consulta);
    res.json(inventario);
})

app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe")
    })
    