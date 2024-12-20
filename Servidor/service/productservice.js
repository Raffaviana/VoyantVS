import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const getProduct = async (req, res) => {
    const { dataInicial, dataFinal } = req.query;
    try {
        const url = "https://voyant-sandbox.myshopify.com/admin/api/2024-10/orders.json";
        const params = {
            processed_at_min: dataInicial,
            processed_at_max: dataFinal,
            status: "any",
            fields: 'id,created_at,customer,line_items,total_price, processed_at',
        };

        const response = await axios.get(url, {
            headers: {
                'X-Shopify-Access-Token': process.env.ACCESS_TOKEN,
            },
            params: params,
        });
        const result = response.data.orders.reduce((acc, order) => {
            order.line_items.forEach((item) => {
              const existingProduct = acc.find((product) => product.name === item.name);
              const price = parseFloat(item.price);
          
              if (existingProduct) {
                existingProduct.quantity += item.quantity;
                existingProduct.totalPrice += price * item.quantity;
              } else {
                acc.push({
                    product_name: item.name,
                    quantity_sold: item.quantity,
                    total_sales_value: price * item.quantity,
                });
              }
            });
          
            return acc;
          }, []);
          if (Object.keys(result).length === 0) {
            res.status(200).json({
                "error": "Nenhuma venda encontrada para o período especificado."
            });
          }else{
            res.status(200).json(result);
          }

    } catch (error) {
        console.log(error);
    }

};

export const getProductMes = async (req, res) => {
    const {mes}  = req.query
    const data = mes.split("-")
    console.log(data);
    const {firstDay, lastDay} = getMonthStartAndEnd(data[0],data[1])
    
    try {
        const url = "https://voyant-sandbox.myshopify.com/admin/api/2024-10/orders.json";
        const params = {
            processed_at_min: firstDay,
            processed_at_max: lastDay,
            status: "any",
            fields: 'id,created_at,customer,line_items,total_price, processed_at',
        };

        const response = await axios.get(url, {
            headers: {
                'X-Shopify-Access-Token': process.env.ACCESS_TOKEN,
            },
            params: params,
        });

        const result = response.data.orders.reduce((acc, order) => {
            order.line_items.forEach((item) => {
              const existingProduct = acc.find((product) => product.name === item.name);
              const price = parseFloat(item.price);
          
              if (existingProduct) {
                existingProduct.quantity += item.quantity;
                existingProduct.totalPrice += price * item.quantity;
              } else {
                acc.push({
                    product_name: item.name,
                    quantity_sold: item.quantity,
                    total_sales_value: price * item.quantity,
                });
              }
            });
          
            return acc;
          }, []);
          if (Object.keys(result).length === 0) {
            res.status(200).json({
                "error": "Nenhuma venda encontrada para o período especificado."
            });
          }else{
            res.status(200).json(result);
          }

    } catch (error) {
        console.log(error);
    }

}

function getMonthStartAndEnd(year, month) {
    const startDate = new Date(year, month - 1, 1); 
    const endDate = new Date(year, month, 0);
    return {
      firstDay: startDate.toISOString().split('T')[0],
      lastDay: endDate.toISOString().split('T')[0],
    };
  }
 
  