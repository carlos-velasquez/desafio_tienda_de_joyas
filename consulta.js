const { Pool } = require('pg');
const format = require('pg-format')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'asterisco',
    database: 'joyas',
    allowExitOnIdle: true
})

const obtenerJoyas = async ({ limits = 6, page = 1, order_by = "stock_ASC" }) => {
    try {
        const [campo, direccion] = order_by.split("_")
        const offset = (page - 1) * limits
        const consulta = format("SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s", campo, direccion, limits, offset);
        pool.query(consulta);
        const { rows: inventario } = await pool.query(consulta);
        return inventario;
    } catch {
        res.status(404).send("error")
    }


}

const obtenerJoyasPorFiltro = async ({ precio_max, precio_min, categoria, metal }) => {
    try {
        let filtros = [];
        const values = [];

        const agregarFiltro = (campo, comparador, valor) => {
            values.push(valor);
            const { length } = filtros;
            filtros.push(`${campo} ${comparador} $${length + 1}`);
        }

        if (precio_max) agregarFiltro('precio', '<=', precio_max);
        if (precio_min) agregarFiltro('precio', '>=', precio_min);
        if (categoria) filtros.push(`categoria = '${categoria}'`);
        if (metal) filtros.push(`metal = '${metal}'`);

        let consulta = "SELECT * FROM inventario";

        if (filtros.length > 0) {
            filtros = filtros.join(" AND ");
            consulta += ` WHERE ${filtros}`;
        }

        const { rows: inventario } = await pool.query(consulta, values);
        return inventario;
    }catch (error) {
        res.status(404).send("error")
    }
   

}

const prepararHATEOAS = (inventario) => {
    const results = inventario.map((i) => {
        return {
            name: i.nombre,
            href: `/inventario/inventario/${i.id} `,
        }
    }).slice(0, 6);
    const total = inventario.length;
    const HATEOAS = {
        total,
        results
    }
    return HATEOAS;
}

const middleware = (req, res, next) => {
    if (Object.keys(req.query).length == 0){
        next();
    } else {
        res.status(404).send("error")
    }
}

module.exports = { obtenerJoyas, obtenerJoyasPorFiltro, prepararHATEOAS, middleware };