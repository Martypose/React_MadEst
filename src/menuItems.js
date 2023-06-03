export const menuItems = [
   {
      title: "Estadisticas",
      url: "estadisticas",
      
     },

     {
      title: "Análisis producción",
      url: "analisisproduccion",
     },
     {
     title: "Paquetes",
     submenu: [
        {
            title: "Listar"
            ,
            url: "paquetes"
           },
        {
         title: "Insertar Normal",
         url: "insertarnormal"
        },
        {
         title: "Insertar Medido",
         url: "insertarmedido"
        }  
       ]
    },
    {
     title: "Pedidos",
     submenu: [
        {
            title: "Listar",
            url: "pedidos"
        },
        {
         title: "Crear Pedido Madera",
         url: "pedidomadera"
        },
        {
         title: "Crear Pedido Biomasa",
         url: "pedidobio"
        }
       ]
    },
    {
     title: "Precios",
     submenu: [
        {
            title: "Madera",
            url: "preciosmadera"
        },
        {
         title: "Biomasa",
         url: "preciosbiomasa"
        }
       ]
    },
    {
     title: "Medidas",
     submenu: [
        {
            title: "Listar",
            url: "medidas"
           },
        {
         title: "Insertar",
         url: "insertarmedida"
        }
  
       ]
    },
    {
     title: "Clientes",
     submenu: [
        {
            title: "Listar",
            url: "clientes"
           },
        {
         title: "Insertar",
         url: "insertarcliente"
        }
  
       ]
    },
    {
     title: "Transporte",
     submenu: [
        {
            title: "Listar Empresas",
            url: "transportistas"
           },
        {
         title: "Insertar",
         url: "insertartransportistas"
        }
  
       ]
    },
    {
     title: "Contabilidad",
     submenu: [
        {
            title: "Facturas",
            url: "facturas"
           },
        {
         title: "Albaran",
         url: "albaran"
        },
        {
         title: "Carta de Porte",
         url: "cartaporte"
        }
  
       ]
    }
   ]